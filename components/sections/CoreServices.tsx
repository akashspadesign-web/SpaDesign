import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { disciplines } from "@/lib/services";

export default function CoreServices() {
  return (
    <section className="border-y border-line bg-bg-alt py-section">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Expertise</SectionLabel>
            <h2 className="mt-6 max-w-[16ch] text-h2 font-light leading-tight tracking-tightish text-balance">
              Four disciplines, one roof
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d, i) => (
            <Reveal as="div" key={d.title} delay={i * 0.06}>
              <Link
                href={d.href}
                className="group flex h-full flex-col justify-between gap-12 bg-bg p-7 transition-colors duration-500 ease-editorial hover:bg-bg-alt"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm tracking-wide text-accent">
                    {d.number}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-ink-soft/40 transition-all duration-300 ease-editorial group-hover:translate-x-1 group-hover:text-accent"
                  >
                    ↗
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl tracking-tightish">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {d.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
