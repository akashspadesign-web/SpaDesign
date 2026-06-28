"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LEAD_STATUSES,
  STATUS_LABEL,
  type LeadStatus,
} from "@/lib/leadSchema";

export default function StatusSelect({
  leadId,
  initial,
}: {
  leadId: string;
  initial: LeadStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<LeadStatus>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus;
    const previous = value;
    setValue(next);
    setError(null);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Update failed.");
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={onChange}
        disabled={pending}
        aria-label="Lead status"
        className="cursor-pointer border border-line bg-bg px-2 py-1 font-mono text-[0.66rem] uppercase tracking-wide text-ink focus:border-ink focus:outline-none"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {error && (
        <span
          role="alert"
          className="font-mono text-[0.6rem] uppercase tracking-wide text-accent"
        >
          {error}
        </span>
      )}
    </span>
  );
}
