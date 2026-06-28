"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin/leads";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Login failed.");
      }
      router.replace(from.startsWith("/admin") ? from : "/admin/leads");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <label className="block">
        <span className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 block w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base text-ink focus:border-ink focus:outline-none focus:ring-0"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          Password
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 block w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-base text-ink focus:border-ink focus:outline-none focus:ring-0"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
