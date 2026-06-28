"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

/**
 * Contact form — no native <form> per brief. Inputs are controlled by React
 * state and submission is fired from the button's onClick. Submissions hit the
 * same /api/leads endpoint the /start-project inquiry form uses, so they land
 * in /admin/leads. `projectType` is fixed to "Other" since this is the general
 * contact channel rather than the project-inquiry channel.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Please enter a valid email.";
    if (phone.trim().length > 0 && phone.trim().length < 6)
      e.phone = "Phone number looks too short.";
    if (message.trim().length < 20)
      e.message = "Please share a few sentences (20+ characters).";
    return e;
  };

  const onSend = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          projectType: "Other",
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setState({ kind: "success" });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  const submitting = state.kind === "submitting";

  return (
    <div className="grid gap-7" aria-label="Send a message">
      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls(!!errors.name)}
          />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls(!!errors.email)}
          />
        </Field>
      </div>

      <Field label="Phone" error={errors.phone}>
        <input
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Optional"
          className={inputCls(!!errors.phone)}
        />
      </Field>

      <Field
        label="Message"
        required
        error={errors.message}
        hint="A few sentences about what you have in mind."
      >
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputCls(!!errors.message), "resize-y leading-relaxed")}
        />
      </Field>

      {state.kind === "error" && (
        <p
          role="alert"
          className="border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink"
        >
          {state.message}
        </p>
      )}
      {state.kind === "success" && (
        <p
          role="status"
          className="border border-line bg-bg-alt px-4 py-3 text-sm text-ink"
        >
          Thank you. Your message is with the studio. We&apos;ll reply within
          one to two working days.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onSend}
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send Message"}
          {!submitting && (
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          )}
        </button>
        <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          We reply within 1–2 working days.
        </p>
      </div>
    </div>
  );
}

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
