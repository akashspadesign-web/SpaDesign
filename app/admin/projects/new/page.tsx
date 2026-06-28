import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projects"
        className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
      >
        ← All projects
      </Link>
      <h1 className="mt-4 font-serif text-4xl tracking-tightish text-ink">
        Add Project
      </h1>
      <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
        Saved into the live portfolio · slug auto-generated from the title
      </p>
      <div className="mt-10 max-w-3xl">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
