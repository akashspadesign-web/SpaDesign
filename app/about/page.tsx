import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/site";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "SPA Design Consultants Pvt. Ltd. Fifty years of architecture, engineering, landscape and interior design, with 600+ projects delivered across India.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-section pt-[calc(var(--nav-h)+5rem)]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>About</SectionLabel>
            <h1 className="mx-auto mt-6 max-w-[14ch] text-[clamp(3.75rem,9vw,9.5rem)] font-light leading-[0.95] tracking-tightish text-balance">
              Fifty years of practice
            </h1>
            <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
              Architecture, engineering, landscape and interior design, under
              one roof, since 1972.
            </p>
          </div>
        </Container>
      </section>

      {/* Feature image */}
      <section className="border-y border-line">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-bg-alt">
          <Image
            src="/images/about-architecture.jpg"
            alt="SPA Design Consultants architectural visualization"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-line bg-ink py-section text-bg">
        <Container>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-white/15 pt-6">
                <dd className="font-serif text-5xl font-light leading-none tracking-tightish sm:text-6xl">
                  {s.value}
                  {s.suffix}
                </dd>
                <dt className="mt-4 max-w-[18ch] font-mono text-[0.72rem] uppercase leading-relaxed tracking-wide text-bg/60">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-section">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <Reveal>
              <SectionLabel>Introduction</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-3xl text-lg leading-relaxed text-ink-soft text-pretty">
                With a modest beginning in 1972 and incorporation as a company
                in 2005, SPA-D has, in a short time, gained keen insight into
                the needs of diverse clients, completing more than 600 small,
                medium and sizeable project assignments and growing steadily
                over the years. Activities have expanded across Jharkhand,
                Uttar Pradesh, Madhya Pradesh, Delhi, Rajasthan and Haryana.
                SPA-D has never looked back, making consistent efforts to prove
                its worth as inseparable architects, consultants and
                professionals across architecture, town planning, landscape
                planning, interior design and structural design, driven by a
                proactive approach and deep commitment to client needs.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Our Team */}
      <section className="border-y border-line bg-bg-alt py-section">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[0.6fr_1.4fr] lg:items-end lg:gap-20">
            <Reveal>
              <SectionLabel>Our Team</SectionLabel>
              <h2 className="mt-6 max-w-[14ch] text-h2 font-light leading-tight tracking-tightish text-ink text-balance">
                Thirteen technocrats. One studio
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-md text-base leading-relaxed text-ink-soft text-pretty">
                Architects, engineers, planners and designers, the core team
                behind every brief.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-hidden rounded-md border border-line bg-bg">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead className="bg-accent text-bg">
                    <tr>
                      <Th className="w-16 text-center">Sr. No.</Th>
                      <Th>Name</Th>
                      <Th>Qualification</Th>
                      <Th className="w-36">Experience</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((m, i) => (
                      <tr
                        key={m.name}
                        className={i % 2 === 1 ? "bg-bg-alt" : "bg-bg"}
                      >
                        <Td className="text-center font-mono text-xs text-ink-soft">
                          {String(i + 1).padStart(2, "0")}
                        </Td>
                        <Td>
                          <span className="font-serif text-base text-ink">
                            {m.name}
                          </span>
                          {m.suffix && (
                            <span className="ml-2 font-mono text-[0.66rem] uppercase tracking-wide text-accent">
                              {m.suffix}
                            </span>
                          )}
                        </Td>
                        <Td className="text-sm leading-relaxed text-ink-soft">
                          {m.qualification}
                        </Td>
                        <Td className="font-mono text-[0.72rem] uppercase tracking-wide text-ink">
                          {m.experience}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="border-y border-line py-section">
        <Container>
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
            <Reveal>
              <SectionLabel>Philosophy</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <blockquote className="font-serif text-3xl font-light leading-snug tracking-tightish text-balance text-ink sm:text-4xl">
                <span aria-hidden className="text-accent">
                  &ldquo;
                </span>
                SPA-D values innovation, partnership and enterprise, guided by
                an attitude of purity, clarity, creativity and sincerity.
                Qualities the firm regards as its most valuable assets. As
                consulting architects, SPA-D believes in{" "}
                <span className="italic">developing the world</span>, not merely
                constructing buildings; it sees itself as far more than a
                housebuilder.
              </blockquote>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 font-mono text-[0.66rem] uppercase tracking-wide ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`border-t border-line px-4 py-4 align-top ${className ?? ""}`}>
      {children}
    </td>
  );
}
