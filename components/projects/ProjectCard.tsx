import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  ratioClassName?: string;
  /** Pass true for the first card above the fold to skip lazy. */
  priority?: boolean;
};

const STATUS_CHIP: Record<string, string> = {
  "Under Construction": "bg-accent text-bg",
  Proposed: "bg-ink text-bg",
};

export default function ProjectCard({
  project,
  ratioClassName = "aspect-[4/3]",
  priority = false,
}: ProjectCardProps) {
  const status = project.status;
  const chipClass = STATUS_CHIP[status];

  return (
    <article
      className="group flex h-full w-full flex-col"
      aria-label={`${project.name}, ${project.category}, ${project.location}`}
    >
      {/* Image frame — uniform aspect across every card; image always centre-cropped. */}
      <div className={cn("relative overflow-hidden bg-bg-alt", ratioClassName)}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-105"
        />

        {chipClass && (
          <span
            className={cn(
              "absolute right-3 top-3 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wide",
              chipClass,
            )}
          >
            {status}
          </span>
        )}
      </div>

      {/* Always-visible text block — category, name, description, area. */}
      <div className="mt-5 flex flex-1 flex-col">
        <p className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
          {project.category}
          <span aria-hidden className="mx-2 text-ink-soft/40">
            ·
          </span>
          {project.location}
        </p>

        <h3 className="mt-2 font-serif text-xl leading-snug tracking-tightish text-ink">
          {project.name}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft text-pretty">
          {project.description}
        </p>

        {project.area && (
          <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft/70">
            {project.area}
          </p>
        )}
      </div>
    </article>
  );
}
