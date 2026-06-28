import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getFounderPhotoUrl } from "@/lib/settings-repo";

export const dynamic = "force-dynamic";

const founderStory = [
  "A consultancy consortium of repute was founded in January 1972, in the name and style of M/S Satyedeo Prasad Agrawal, with its primary office at Ranchi, now in Jharkhand State.",
  "Sensing the ever-growing need for competent, highly qualified consultants able to operate in a complex and fast-changing economic and industrial environment, SPA-D was conceived by Late Satyedeo Prasad Agrawal, who had individually been a practicing architect and structural consultant since January 1972.",
  "Subsequently, as his children grew into highly educated technocrats across architecture, town planning, landscape planning, interior design and structural design, practicing individually and then joining together, SPA Design Consultants Pvt. Ltd. was incorporated on 18th November 2005, with its corporate office at E-33, Sector-3, Noida (U.P.) 201301. Its mission: to deliver highly innovative consulting across Architecture, Town Planning, Landscape Planning, Interior Design, Structural Design and related services, and to play a creative role in service to humanity.",
];

export default async function Intro() {
  const founderPhotoUrl = await getFounderPhotoUrl();

  return (
    <section className="py-section">
      <Container>
        <SectionLabel>The Studio</SectionLabel>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="max-w-[18ch] text-h1 font-light leading-[1.05] tracking-tightish text-balance">
                A multi-disciplinary studio. Since 1972
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft text-pretty">
                Founded in Ranchi by Late Satyedeo Prasad Agrawal. 600+ projects
                across India.
              </p>
            </Reveal>

            {/* Founder story, five decades, in three paragraphs */}
            <Reveal delay={0.14}>
              <div className="mt-12 border-t border-line pt-10">
                <h3 className="font-serif text-2xl tracking-tightish text-ink">
                  Five Decades of Design
                </h3>
                <div className="mt-5 space-y-5 text-base leading-relaxed text-ink-soft text-pretty">
                  {founderStory.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <ButtonLink
                href="/about"
                variant="ghost"
                withArrow
                className="mt-10 !px-0"
              >
                About the Studio
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <figure className="lg:pt-2 lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              {/* Founder portrait — 3:2 landscape, max-w bounded by the column;
                  object-cover at the same aspect causes effectively zero crop. */}
              <div className="relative mx-auto aspect-[3/2] w-full max-w-xl overflow-hidden bg-bg-alt">
                <Image
                  src={founderPhotoUrl}
                  alt="Late Satyedeo Prasad Agrawal, founder of SPA Design Consultants"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                  priority={false}
                />
              </div>
              <figcaption className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                <span className="block font-serif text-base text-ink">
                  Founded by Late Satyedeo Prasad Agrawal
                </span>
                <span className="mt-1 block">
                  The legacy is now carried forward by Ar. Prabhat Agrawal and
                  Priti Agrawal
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
