import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import { ButtonLink } from "@/components/ui/Button";

/** Stub entries — CMS-ready. Replace with real posts when the journal is wired. */
const posts = [
  {
    slug: "#",
    category: "Practice",
    title: "Fifty years of building across India",
    date: "Coming soon",
  },
  {
    slug: "#",
    category: "Project",
    title: "Inside the Ecotech XI industrial cluster",
    date: "Coming soon",
  },
  {
    slug: "#",
    category: "Process",
    title: "From site survey to completion certificate",
    date: "Coming soon",
  },
];

export default function JournalPreview() {
  return (
    <section className="py-section">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="09">Journal</SectionLabel>
            <h2 className="mt-6 max-w-[16ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance">
              Notes from the studio
            </h2>
          </div>
          <ButtonLink href="/journal" variant="ghost" withArrow className="!px-0">
            All Articles
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal as="div" key={i} delay={i * 0.08}>
              <Link href={post.slug} className="group block">
                <div className="overflow-hidden">
                  <div className="transition-transform duration-700 ease-editorial group-hover:scale-[1.03]">
                    <Placeholder
                      label={post.title}
                      dimensions="1200 × 800"
                      ratioClassName="aspect-[3/2]"
                      note={post.category}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wide text-accent">
                    {post.category}
                  </span>
                  <span aria-hidden className="h-px w-6 bg-line" />
                  <span className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-soft/70">
                    {post.date}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-snug tracking-tightish text-balance">
                  {post.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
