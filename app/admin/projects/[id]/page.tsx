import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects-repo";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/projects"
        className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
      >
        ← All projects
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-serif text-4xl tracking-tightish text-ink">
            Edit Project
          </h1>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            {project.slug}
            <span aria-hidden className="mx-2 text-ink-soft/40">
              ·
            </span>
            Last updated{" "}
            {project.updatedAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <div className="mt-10">
            <ProjectForm mode="edit" project={project} />
          </div>
        </div>

        <aside className="lg:border-l lg:border-line lg:pl-10">
          <p className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
            Current image
          </p>
          <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-bg-alt">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover object-center"
            />
          </div>
          <p className="mt-3 break-all font-mono text-[0.62rem] text-ink-soft/70">
            {project.image}
          </p>
        </aside>
      </div>
    </div>
  );
}
