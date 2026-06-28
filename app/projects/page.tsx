import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectsBrowser from "@/components/projects/ProjectsBrowser";
import { PROJECT_CATEGORIES } from "@/lib/projects";
import { getAllProjects } from "@/lib/projects-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by SPA Design Consultants. Institutional, commercial, industrial, residential and hospitality projects across India.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="pb-section pt-[calc(var(--nav-h)+5rem)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Portfolio</SectionLabel>
          <h1 className="mx-auto mt-6 max-w-[12ch] text-display font-light leading-[0.95] tracking-tightish text-balance">
            Projects
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
            {projects.length} projects across institutional, commercial,
            industrial, residential and hospitality work. Five decades of
            building across India.
          </p>
        </div>

        <div className="mt-16">
          <ProjectsBrowser
            projects={projects}
            categories={[...PROJECT_CATEGORIES]}
          />
        </div>
      </Container>
    </section>
  );
}
