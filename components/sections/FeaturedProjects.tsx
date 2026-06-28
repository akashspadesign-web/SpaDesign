import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedProjects } from "@/lib/projects-repo";

export const dynamic = "force-dynamic";

export default async function FeaturedProjects() {
  // Landing teaser: cap at the first 6. The /projects page still shows all.
  const featured = (await getFeaturedProjects()).slice(0, 6);

  return (
    <section className="py-section">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="mt-6 max-w-[18ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance">
              Selected work
            </h2>
          </div>
          <ButtonLink href="/projects" variant="ghost" withArrow className="!px-0">
            All Projects
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal as="div" key={p.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
