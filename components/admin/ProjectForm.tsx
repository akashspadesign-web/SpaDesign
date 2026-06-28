"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project } from "@/lib/projects";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/projects";
import { projectCreateSchema, type ProjectCreateInput } from "@/lib/projectSchema";
import { cn } from "@/lib/cn";

type ProjectFormProps =
  | { mode: "create"; project?: undefined }
  | { mode: "edit"; project: Project };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export default function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<
    | { kind: "idle" }
    | { kind: "uploading"; name: string }
    | { kind: "uploaded"; url: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectCreateInput>({
    resolver: zodResolver(projectCreateSchema),
    mode: "onBlur",
    defaultValues:
      mode === "edit"
        ? {
            name: project.name,
            category: project.category as ProjectCreateInput["category"],
            location: project.location,
            description: project.description ?? "",
            image: project.image,
            area: project.area ?? "",
            status: (project.status as ProjectCreateInput["status"]) ?? "Completed",
            featured: project.featured,
          }
        : {
            name: "",
            category: undefined as unknown as ProjectCreateInput["category"],
            location: "",
            description: "",
            image: "",
            area: "",
            status: "Completed",
            featured: false,
          },
  });

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUpload({ kind: "error", message: "Please choose an image file." });
      return;
    }
    setUpload({ kind: "uploading", name: file.name });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Upload failed.");
      }
      const { url } = (await res.json()) as { url: string };
      setValue("image", url, { shouldValidate: true, shouldDirty: true });
      setUpload({ kind: "uploaded", url });
    } catch (err) {
      setUpload({
        kind: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  };

  const onSubmit = async (values: ProjectCreateInput) => {
    setState({ kind: "submitting" });
    const url =
      mode === "create" ? "/api/projects" : `/api/projects/${project!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Save failed.");
      }
      if (mode === "create") {
        router.replace("/admin/projects");
        router.refresh();
      } else {
        setState({ kind: "success", message: "Saved." });
        router.refresh();
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Save failed.",
      });
    }
  };

  const onDelete = async () => {
    if (mode !== "edit") return;
    const ok = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`,
    );
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Delete failed.");
      }
      router.replace("/admin/projects");
      router.refresh();
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Delete failed.",
      });
      setDeleting(false);
    }
  };

  const submitting = state.kind === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-7"
      aria-label={mode === "create" ? "Add project" : `Edit ${project!.name}`}
    >
      <div className="grid gap-7 md:grid-cols-[1.4fr_0.6fr]">
        <Field label="Title" required error={errors.name?.message}>
          <input
            type="text"
            autoComplete="off"
            {...register("name")}
            className={inputCls(!!errors.name)}
          />
        </Field>
        <Field label="Category" required error={errors.category?.message}>
          <select
            {...register("category")}
            defaultValue={
              mode === "edit" ? project.category : ""
            }
            className={selectCls(!!errors.category)}
          >
            {mode === "create" && (
              <option value="" disabled>
                Select…
              </option>
            )}
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Location" required error={errors.location?.message}>
          <input
            type="text"
            {...register("location")}
            className={inputCls(!!errors.location)}
            placeholder="City / sector"
          />
        </Field>
        <Field label="Area" error={errors.area?.message}>
          <input
            type="text"
            {...register("area")}
            className={inputCls(!!errors.area)}
            placeholder='e.g. 4,000 sqm'
          />
        </Field>
      </div>

      <Field
        label="Image"
        required
        hint='Upload a file, take a photo, or paste a path under /public (e.g. "/projects/my-project.jpg").'
        error={errors.image?.message}
      >
        <input
          type="text"
          {...register("image")}
          className={inputCls(!!errors.image)}
          placeholder="/projects/<file>.jpg"
        />

        {/* Hidden native inputs — triggered by the styled buttons below. */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.currentTarget.value = ""; // allow re-selecting the same file
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={upload.kind === "uploading"}
            className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-2 font-mono text-[0.66rem] uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
          >
            Choose File
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={upload.kind === "uploading"}
            className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-2 font-mono text-[0.66rem] uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
          >
            Take Photo
          </button>
          {upload.kind === "uploading" && (
            <span className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
              Uploading {upload.name}…
            </span>
          )}
          {upload.kind === "uploaded" && (
            <span className="font-mono text-[0.66rem] uppercase tracking-wide text-accent">
              Uploaded · {upload.url}
            </span>
          )}
          {upload.kind === "error" && (
            <span
              role="alert"
              className="font-mono text-[0.66rem] uppercase tracking-wide text-accent"
            >
              {upload.message}
            </span>
          )}
        </div>
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <textarea
          rows={3}
          {...register("description")}
          className={cn(inputCls(!!errors.description), "resize-y leading-relaxed")}
          placeholder="One or two sentences shown beneath the card."
        />
      </Field>

      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Status" error={errors.status?.message}>
          <select
            {...register("status")}
            defaultValue={
              mode === "edit" ? (project.status ?? "Completed") : "Completed"
            }
            className={selectCls(!!errors.status)}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex items-end gap-3 pb-2">
          <input
            type="checkbox"
            {...register("featured")}
            className="h-5 w-5 accent-[var(--color-accent)]"
          />
          <span className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft">
            Featured on the home page
          </span>
        </label>
      </div>

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
          className="border border-line bg-bg-alt px-4 py-3 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting || deleting}
            className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent disabled:opacity-50"
          >
            {submitting
              ? "Saving…"
              : mode === "create"
                ? "Create project"
                : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft hover:text-accent"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting || submitting}
            className="font-mono text-[0.72rem] uppercase tracking-wide text-accent hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete project"}
          </button>
        )}
      </div>
    </form>
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
  "block w-full appearance-none border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 transition-colors focus:border-ink focus:outline-none focus:ring-0";

function inputCls(error: boolean) {
  return cn(inputBase, error && "border-accent");
}

function selectCls(error: boolean) {
  return cn(inputBase, "cursor-pointer pr-8", error && "border-accent");
}
