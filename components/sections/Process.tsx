import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { processSteps } from "@/lib/services";

export default function Process() {
  return (
    <section className="py-section">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Process</SectionLabel>
            <h2 className="mt-6 max-w-[16ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance">
              Three stages
            </h2>
          </div>
        </div>

        <div className="mt-16 space-y-0">
          {processSteps.map((step, i) => (
            <Reveal as="div" key={step.number} delay={i * 0.05}>
              <div className="grid gap-6 border-t border-line py-10 md:grid-cols-[auto_1fr_1.2fr] md:gap-12">
                <span className="font-serif text-5xl font-light leading-none text-accent">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-serif text-3xl tracking-tightish">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft/70">
                    {step.stage}
                  </p>
                  <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
                <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 md:self-center">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-snug text-ink-soft"
                    >
                      <span aria-hidden className="mt-1 text-accent">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </Container>
    </section>
  );
}
