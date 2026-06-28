import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * Stand-in for the pinned 3D "building rises as you scroll" hero (Build Step 3).
 * Designed to read as a finished hero so the page reviews top-to-bottom, with a
 * small honest marker that the WebGL scene will replace this block.
 */
export default function HeroPlaceholder() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-bg-alt pb-14 pt-nav"
    >
      {/* horizon / sky wash standing in for the empty-plot opening frame */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f6f3ed 0%, #f2efe9 52%, #ece7dd 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(232,119,26,0.06))",
        }}
      />
      {/* faint ground grid */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%] opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, transparent, #000 90%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 90%)",
        }}
      />

      {/* placeholder marker */}
      <div className="absolute right-gutter top-[calc(var(--nav-h)+1.5rem)] z-10 hidden max-w-[15rem] border border-line bg-bg/70 p-3 backdrop-blur-sm md:block">
        <p className="eyebrow text-accent">Hero placeholder</p>
        <p className="mt-1 font-mono text-[0.68rem] leading-relaxed text-ink-soft">
          The pinned 3D scroll-build sequence (building rises as you scroll)
          lands here in Step 3.
        </p>
      </div>

      <Container className="relative z-10">
        <Reveal>
          <p className="eyebrow mb-6">
            {site.disciplines} · Since {site.foundedYear}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-[16ch] text-display font-light leading-[0.92] tracking-tightish text-balance">
            Renovate Your{" "}
            <span className="italic text-accent">Imaginations</span>
          </h1>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
            Fifty years. Six hundred projects. One studio. Designing
            architecture, interiors, landscape and structure across India since
            1972.
          </p>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/projects" variant="primary" withArrow>
              View Projects
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Start a Project
            </ButtonLink>
          </div>
        </Reveal>
      </Container>

      {/* scroll cue */}
      <Container className="relative z-10 mt-14">
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="h-px w-10 bg-ink-soft/40" />
          <span className="font-mono text-[0.68rem] uppercase tracking-wide">
            Scroll to build
          </span>
        </div>
      </Container>
    </section>
  );
}
