"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/cn";
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  leadCreateSchema,
  type LeadCreateInput,
} from "@/lib/leadSchema";
import { Button } from "@/components/ui/Button";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function StartProjectForm() {
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const honeypotWrapperRef = useRef<HTMLDivElement>(null);

  // `inert` was added to the React types in 19. We're on React 18, so set it
  // on the DOM element directly via the ref — same effect, no TS workaround.
  useEffect(() => {
    if (honeypotWrapperRef.current) honeypotWrapperRef.current.inert = true;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadCreateInput>({
    resolver: zodResolver(leadCreateSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: "",
      location: "",
      message: "",
      contact_time: "",
    },
  });

  const onSubmit = async (values: LeadCreateInput) => {
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ??
            "Something went wrong — please try again.",
        );
      }
      reset();
      setState({ kind: "success" });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong — please try again.",
      });
    }
  };

  const submitting = state.kind === "submitting";

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-7"
        aria-label="Start a project inquiry"
      >
        {/* Honeypot — bots fill this; humans never see, focus, or interact with it. */}
        <div
          ref={honeypotWrapperRef}
          className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
        >
          <label>
            Contact time
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("contact_time")}
            />
          </label>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <Field label="Name" required error={errors.name?.message}>
            <input
              type="text"
              autoComplete="name"
              {...register("name")}
              className={inputCls(!!errors.name)}
            />
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className={inputCls(!!errors.email)}
            />
          </Field>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <Field label="Phone" error={errors.phone?.message}>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="Optional"
              {...register("phone")}
              className={inputCls(!!errors.phone)}
            />
          </Field>
          <Field label="Project location" error={errors.location?.message}>
            <input
              type="text"
              placeholder="City, country"
              {...register("location")}
              className={inputCls(!!errors.location)}
            />
          </Field>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <Field
            label="Project type"
            required
            error={errors.projectType?.message}
          >
            <select
              {...register("projectType")}
              defaultValue=""
              className={selectCls(!!errors.projectType)}
            >
              <option value="" disabled>
                Select one…
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget range" error={errors.budget?.message}>
            <select
              {...register("budget")}
              defaultValue=""
              className={selectCls(!!errors.budget)}
            >
              <option value="">Optional</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Project brief"
          required
          error={errors.message?.message}
          hint="A few sentences on the project, site, and timeline."
        >
          <textarea
            rows={6}
            {...register("message")}
            className={cn(
              inputCls(!!errors.message),
              "resize-y leading-relaxed",
            )}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="submit" disabled={submitting} withArrow>
            {submitting ? "Sending…" : "Send Inquiry"}
          </Button>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            We reply within 1–2 working days.
          </p>
        </div>
      </form>

      {state.kind === "success" && (
        <Modal
          tone="success"
          title="Inquiry sent successfully"
          body="Thank you — your project brief is with the studio. A principal will read it and reply by email within one to two working days."
          closeLabel="Close"
          onClose={() => setState({ kind: "idle" })}
        />
      )}

      {state.kind === "error" && (
        <Modal
          tone="error"
          title="Something went wrong"
          body={state.message || "Please try again in a moment."}
          closeLabel="Try again"
          onClose={() => setState({ kind: "idle" })}
        />
      )}
    </>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────── */

function Modal({
  tone,
  title,
  body,
  closeLabel,
  onClose,
}: {
  tone: "success" | "error";
  title: string;
  body: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock background scroll, ESC to close, focus the close button on open.
  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const accent = tone === "success" ? "text-accent" : "text-ink";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-10"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-sm animate-fade-up"
      />
      {/* Card */}
      <div className="relative w-full max-w-md border border-line bg-bg p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)] sm:p-10 animate-fade-up">
        <p
          className={cn(
            "font-mono text-[0.7rem] uppercase tracking-wide",
            accent,
          )}
        >
          {tone === "success" ? "Inquiry received" : "Submission failed"}
        </p>
        <h2
          id="modal-title"
          className="mt-4 font-serif text-3xl leading-snug tracking-tightish text-ink sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft text-pretty">
          {body}
        </p>
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Field + input helpers ───────────────────────────────────────────── */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </span>
        {error && (
          <span className="font-mono text-[0.66rem] uppercase tracking-wide text-accent">
            {error}
          </span>
        )}
      </span>
      <span className="mt-2 block">{children}</span>
      {hint && !error && (
        <span className="mt-1.5 block font-mono text-[0.66rem] text-ink-soft/70">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputBase =
  "block w-full appearance-none border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-ink focus:outline-none focus:ring-0";

function inputCls(error: boolean) {
  return cn(inputBase, error && "border-accent");
}

function selectCls(error: boolean) {
  return cn(inputBase, "cursor-pointer pr-8", error && "border-accent");
}
