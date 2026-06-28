import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { services, processStages } from "@/lib/service-catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture, structural engineering, interiors, landscape, MEP and turnkey execution. The full complement of services in-house at SPA Design Consultants.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-section pt-[calc(var(--nav-h)+5rem)]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Services</SectionLabel>
            <h1 className="mx-auto mt-6 max-w-[14ch] text-display font-light leading-[0.95] tracking-tightish text-balance">
              Everything under one roof
            </h1>
            <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
              We offer the entire complement of services in-house, reducing
              coordination problems, cutting implementation time, and ensuring
              efficient budget control.
            </p>
          </div>
        </Container>
      </section>

      {/* Service cards */}
      <section className="border-y border-line bg-bg-alt py-section">
        <Container>
          <SectionLabel>Disciplines</SectionLabel>
          <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal as="div" key={s.slug} delay={(i % 2) * 0.06}>
                <article className="flex h-full flex-col gap-6 bg-bg p-8 lg:p-10">
                  <header>
                    <span className="font-mono text-sm tracking-wide text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="mt-3 font-serif text-2xl leading-snug tracking-tightish text-ink">
                      {s.title}
                    </h2>
                  </header>
                  <p className="text-base leading-relaxed text-ink-soft text-pretty">
                    {s.summary}
                  </p>
                  <ul className="mt-auto space-y-2">
                    {s.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-2.5 text-sm leading-snug text-ink-soft"
                      >
                        <span aria-hidden className="mt-1 text-accent">
                          —
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-section">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>Process</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance text-ink">
                Three stages, end to end
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              The same process that has carried 600+ projects from a blank site
              to a completion certificate.
            </p>
          </div>

          <ol className="mt-16 space-y-0">
            {processStages.map((stage, i) => (
              <Reveal as="li" key={stage.stage} delay={i * 0.05}>
                <div className="grid gap-6 border-t border-line py-10 md:grid-cols-[auto_1fr_1.4fr] md:gap-12">
                  <span className="font-serif text-5xl font-light leading-none text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft/70">
                      {stage.stage}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl tracking-tightish text-ink">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="max-w-md text-base leading-relaxed text-ink-soft text-pretty">
                    {stage.description}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-line" />
          </ol>
        </Container>
      </section>
    </>
  );
}
