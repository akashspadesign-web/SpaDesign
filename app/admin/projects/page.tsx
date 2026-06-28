import Link from "next/link";
import Image from "next/image";
import { getAllProjects, countProjectsByCategory } from "@/lib/projects-repo";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/projects";
import ProjectsAdminBrowser from "@/components/admin/ProjectsAdminBrowser";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [all, counts] = await Promise.all([
    getAllProjects(),
    countProjectsByCategory(),
  ]);

  const activeRaw = searchParams.category;
  const activeCategory =
    activeRaw && (PROJECT_CATEGORIES as readonly string[]).includes(activeRaw)
      ? (activeRaw as ProjectCategory)
      : ("All" as const);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            Portfolio
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tightish text-ink">
            Projects
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-accent"
        >
          + Add Project
        </Link>
      </div>

      <ProjectsAdminBrowser
        projects={all}
        categories={[...PROJECT_CATEGORIES]}
        counts={counts}
        initialFilter={activeCategory}
      />

      {/* Tiny preview-on-list using next/image to keep a familiar pattern. */}
      <noscript>
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {all.map((p) => (
            <div key={p.id} className="bg-bg p-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
                {p.category} · {p.location}
              </p>
              <p className="mt-1 font-serif text-base text-ink">{p.name}</p>
            </div>
          ))}
        </div>
      </noscript>
    </div>
  );
}
