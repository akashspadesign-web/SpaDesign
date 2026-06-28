import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { whyUs } from "@/lib/services";

export default function WhyUs() {
  return (
    <section className="border-y border-line bg-bg-alt py-section">
      <Container>
        <SectionLabel index="06">Why SPA</SectionLabel>
        <h2 className="mt-6 max-w-[20ch] text-h2 font-light leading-tight tracking-tightish text-balance">
          Fifty years of practice
        </h2>

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((reason, i) => (
            <Reveal as="div" key={reason.number} delay={(i % 3) * 0.06}>
              <div className="border-t border-line pt-5">
                <span className="font-mono text-sm tracking-wide text-accent">
                  {reason.number}
                </span>
                <h3 className="mt-4 font-serif text-2xl leading-snug tracking-tightish">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {reason.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
