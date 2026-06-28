"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/cn";
import type { Project, ProjectCategory } from "@/lib/projects";

type Filter = "All" | ProjectCategory;

export default function ProjectsBrowser({
  projects,
  categories,
}: {
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [active, setActive] = useState<Filter>("All");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>();
    map.set("All", projects.length);
    for (const c of categories) {
      map.set(c, projects.filter((p) => p.category === c).length);
    }
    return map;
  }, [projects, categories]);

  const filtered = useMemo(() => {
    const list =
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active);
    // Featured first, then the rest in original (curated) order.
    return [...list].sort(
      (a, b) => Number(b.featured) - Number(a.featured),
    );
  }, [active, projects]);

  const tabs: Filter[] = ["All", ...categories];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((t) => {
          const isActive = active === t;
          const count = counts.get(t) ?? 0;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t)}
              className={cn(
                "inline-flex items-center gap-2 border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-wide transition-colors duration-300 ease-editorial focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
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

      {filtered.length === 0 ? (
        <p className="mt-16 text-center font-serif text-2xl text-ink-soft">
          No projects in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal as="div" key={p.slug} delay={(i % 3) * 0.06}>
              <ProjectCard project={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
