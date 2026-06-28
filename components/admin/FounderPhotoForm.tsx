"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; name: string }
  | { kind: "saving" }
  | { kind: "success"; url: string }
  | { kind: "error"; message: string };

export default function FounderPhotoForm({
  initialUrl,
  defaultUrl,
  isDefault,
}: {
  initialUrl: string;
  defaultUrl: string;
  isDefault: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [draft, setDraft] = useState(initialUrl);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [resetting, setResetting] = useState(false);
  const onDefault = url === defaultUrl;

  // Pick a file (or take a photo) → upload to /api/upload → setDraft to the returned URL.
  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", message: "Please choose an image file." });
      return;
    }
    setStatus({ kind: "uploading", name: file.name });
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
      const { url: uploadedUrl } = (await res.json()) as { url: string };
      setDraft(uploadedUrl);
      // Auto-save the newly uploaded URL so the change is one click, not two.
      await saveUrl(uploadedUrl);
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  };

  const saveUrl = async (next: string) => {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ founderPhotoUrl: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Could not save.");
      }
      const { founderPhotoUrl } = (await res.json()) as {
        founderPhotoUrl: string;
      };
      setUrl(founderPhotoUrl);
      setDraft(founderPhotoUrl);
      setStatus({ kind: "success", url: founderPhotoUrl });
      router.refresh();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Could not save.",
      });
    }
  };

  const onResetToDefault = async () => {
    if (
      !window.confirm(
        "Restore the default founder photo? The currently-set photo will be detached.",
      )
    )
      return;
    setResetting(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/admin/site-settings", { method: "DELETE" });
      if (!res.ok) throw new Error("Reset failed.");
      const { founderPhotoUrl } = (await res.json()) as {
        founderPhotoUrl: string;
      };
      setUrl(founderPhotoUrl);
      setDraft(founderPhotoUrl);
      setStatus({ kind: "success", url: founderPhotoUrl });
      router.refresh();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Reset failed.",
      });
    } finally {
      setResetting(false);
    }
  };

  const busy =
    status.kind === "uploading" || status.kind === "saving" || resetting;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-7">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            Image path or URL
          </p>
          <p className="mt-1 font-mono text-[0.66rem] text-ink-soft/70">
            {isDefault || onDefault
              ? "Currently using the default photo bundled with the site."
              : "Currently using an admin-managed photo."}
          </p>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="/images/founders.jpg"
            className="mt-3 block w-full appearance-none border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none"
          />
        </div>

        {/* Hidden native inputs triggered by the styled buttons. */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.currentTarget.value = "";
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-2 font-mono text-[0.66rem] uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
          >
            Choose File
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-2 font-mono text-[0.66rem] uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg disabled:opacity-50"
          >
            Take Photo
          </button>
          {status.kind === "uploading" && (
            <span className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
              Uploading {status.name}…
            </span>
          )}
          {status.kind === "saving" && (
            <span className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
              Saving…
            </span>
          )}
          {status.kind === "success" && (
            <span className="font-mono text-[0.66rem] uppercase tracking-wide text-accent">
              Saved · {status.url}
            </span>
          )}
          {status.kind === "error" && (
            <span
              role="alert"
              className="font-mono text-[0.66rem] uppercase tracking-wide text-accent"
            >
              {status.message}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => saveUrl(draft)}
              disabled={busy || draft.trim() === url}
              className={cn(
                "inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent",
                "disabled:opacity-50",
              )}
            >
              Save photo
            </button>
            {draft !== url && (
              <button
                type="button"
                onClick={() => {
                  setDraft(url);
                  setStatus({ kind: "idle" });
                }}
                disabled={busy}
                className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
              >
                Cancel
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onResetToDefault}
            disabled={busy || onDefault}
            className="font-mono text-[0.7rem] uppercase tracking-wide text-accent hover:underline disabled:opacity-50"
          >
            {resetting ? "Resetting…" : "Reset to default"}
          </button>
        </div>
      </div>

      <aside className="lg:border-l lg:border-line lg:pl-10">
        <p className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
          Current preview
        </p>
        <div className="relative mt-3 aspect-[3/2] overflow-hidden bg-bg-alt">
          {/* `unoptimized` so admins see freshly-uploaded images without Next's cache delay. */}
          <Image
            src={url}
            alt="Current founder photo"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            unoptimized
            className="object-cover object-center"
          />
        </div>
        <p className="mt-3 break-all font-mono text-[0.62rem] text-ink-soft/70">
          {url}
        </p>
      </aside>
    </div>
  );
}
