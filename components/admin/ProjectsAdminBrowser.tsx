"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Project, ProjectCategory } from "@/lib/projects";

type Filter = "All" | ProjectCategory;

export default function ProjectsAdminBrowser({
  projects,
  categories,
  counts,
  initialFilter,
}: {
  projects: Project[];
  categories: ProjectCategory[];
  counts: Record<string, number>;
  initialFilter: Filter;
}) {
  const router = useRouter();
  const [active, setActive] = useState<Filter>(initialFilter);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const list =
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active);
    return [...list].sort(
      (a, b) => Number(b.featured) - Number(a.featured),
    );
  }, [active, projects]);

  const tabs: Filter[] = ["All", ...categories];

  const deleteProject = async (p: Project) => {
    const ok = window.confirm(
      `Delete "${p.name}"? This cannot be undone.`,
    );
    if (!ok) return;
    setBusyId(p.id);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Delete failed.");
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((t) => {
          const isActive = active === t;
          const count = t === "All" ? projects.length : counts[t] ?? 0;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t)}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              <span>{t}</span>
              <span
                className={cn(
                  "tabular-nums",
                  isActive ? "text-bg/70" : "text-ink-soft/60",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
        Showing {filtered.length} project{filtered.length === 1 ? "" : "s"}
        {active !== "All" && ` · ${active}`}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink"
        >
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="mt-12 text-center font-serif text-2xl text-ink-soft">
          No projects in this category yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const busy = busyId === p.id;
            return (
              <li
                key={p.id}
                className="flex flex-col bg-bg p-4"
              >
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="group block"
                  aria-label={`Edit ${p.name}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {p.featured && (
                      <span className="absolute left-2 top-2 bg-accent px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-bg">
                        Featured
                      </span>
                    )}
                    {p.status !== "Completed" && (
                      <span className="absolute right-2 top-2 bg-ink px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-bg">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
                    {p.category}
                    <span aria-hidden className="mx-2 text-ink-soft/40">
                      ·
                    </span>
                    {p.location}
                  </p>
                  <h2 className="mt-1 font-serif text-lg leading-snug tracking-tightish text-ink">
                    {p.name}
                  </h2>
                </Link>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="font-mono text-[0.66rem] uppercase tracking-wide text-ink hover:text-accent"
                  >
                    Edit →
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProject(p)}
                    disabled={busy}
                    className="font-mono text-[0.66rem] uppercase tracking-wide text-accent hover:underline disabled:opacity-50"
                  >
                    {busy ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
