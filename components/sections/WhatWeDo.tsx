import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import { whatWeDo } from "@/lib/services";

export default function WhatWeDo() {
  return (
    <section className="border-y border-line bg-bg-alt py-section">
      <Container>
        <SectionLabel index="04">Typologies</SectionLabel>
        <h2 className="mt-6 max-w-[20ch] text-h2 font-light leading-tight tracking-tightish text-balance">
          Across the built environment
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {whatWeDo.map((label, i) => (
            <Reveal as="div" key={label} delay={(i % 4) * 0.05}>
              <div className="group relative bg-bg">
                <Placeholder
                  label={label}
                  dimensions="800 × 800"
                  ratioClassName="aspect-square"
                  note="Typology"
                />
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 to-transparent p-4 opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100">
                  <span className="font-serif text-lg text-bg">{label}</span>
                </div>
                <span className="absolute left-3 top-3 font-mono text-[0.62rem] uppercase tracking-wide text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
