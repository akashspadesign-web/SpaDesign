"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

/**
 * CMS-ready structure. Replace with client-supplied quotes — the carousel reads
 * straight from this array. Entries are clearly marked as placeholders.
 */
const testimonials: Testimonial[] = [
  {
    quote:
      "[Client testimonial to be supplied.] A short paragraph on the relationship, the brief and how the building performs in use.",
    name: "Client name",
    role: "Institutional project · Noida",
  },
  {
    quote:
      "[Client testimonial to be supplied.] One or two sentences on delivery, coordination and the result on site.",
    name: "Client name",
    role: "Industrial project · Greater Noida",
  },
  {
    quote:
      "[Client testimonial to be supplied.] A line on working with the studio across stages, from concept to completion.",
    name: "Client name",
    role: "Turnkey interiors · Pan-India",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const count = testimonials.length;
  const t = testimonials[active];

  return (
    <section className="py-section">
      <Container>
        <SectionLabel>In Their Words</SectionLabel>

        <figure className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <blockquote className="max-w-4xl">
            <p className="font-serif text-3xl font-light leading-snug tracking-tightish text-balance sm:text-4xl lg:text-[2.75rem]">
              <span aria-hidden className="text-accent">
                “
              </span>
              {t.quote}
            </p>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className="font-serif text-lg">{t.name}</span>
              <span aria-hidden className="h-px w-8 bg-line" />
              <span className="font-mono text-[0.72rem] uppercase tracking-wide text-ink-soft">
                {t.role}
              </span>
            </figcaption>
          </blockquote>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setActive((a) => (a - 1 + count) % count)}
              className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
            >
              ←
            </button>
            <span className="font-mono text-sm tabular-nums text-ink-soft">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setActive((a) => (a + 1) % count)}
              className="flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
            >
              →
            </button>
          </div>
        </figure>
      </Container>
    </section>
  );
}
