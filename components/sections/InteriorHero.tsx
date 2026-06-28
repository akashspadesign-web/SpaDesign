"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const InteriorScene = dynamic(() => import("@/three/interior/InteriorScene"), {
  ssr: false,
});

// Must match the phase windows in three/interior/InteriorScene.tsx.
const PHASES: Array<{ at: number; label: string }> = [
  { at: 0.0, label: "Floor plan" },
  { at: 0.16, label: "Raising walls" },
  { at: 0.3, label: "Slatted feature wall" },
  { at: 0.34, label: "Hanging curtains" },
  { at: 0.4, label: "Laying rug" },
  { at: 0.46, label: "Placing bed" },
  { at: 0.62, label: "Setting sofa" },
  { at: 0.66, label: "Side table" },
  { at: 0.68, label: "Lighting lamp" },
  { at: 0.72, label: "Setting desk" },
  { at: 0.78, label: "Pulling up chair" },
  { at: 0.86, label: "Adding greenery" },
  { at: 0.94, label: "Final touch" },
];

const SkyWash = () => (
  <>
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
          "linear-gradient(180deg, transparent, rgba(232,119,26,0.05))",
      }}
    />
  </>
);

function InteriorCopy() {
  return (
    <>
      <Reveal>
        <p className="eyebrow mb-6">Interiors</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="max-w-[18ch] text-display font-light leading-[0.92] tracking-tightish text-balance">
          Rooms, <span className="italic text-accent">composed</span>
        </h1>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-8 max-w-md text-base leading-relaxed text-ink-soft">
          Residential, hospitality, workplace.
        </p>
      </Reveal>
      <Reveal delay={0.26}>
        <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="/projects" variant="primary" withArrow>
            Projects
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact
          </ButtonLink>
        </div>
      </Reveal>
    </>
  );
}

function StaticInteriorHero() {
  return (
    <section
      aria-label="Interior Design"
      className="relative min-h-[100svh] overflow-hidden bg-bg-alt"
    >
      <SkyWash />
      <div className="pointer-events-none absolute inset-0">
        <InteriorScene staticProgress={1} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-14">
        <Container>
          <InteriorCopy />
        </Container>
      </div>
    </section>
  );
}

function phaseLabelFor(p: number): string {
  let label = PHASES[0].label;
  for (const phase of PHASES) {
    if (p >= phase.at) label = phase.label;
  }
  return label;
}

function ScrollInteriorHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState({
    label: PHASES[0].label,
    pct: 0,
  });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setReadout({
      label: phaseLabelFor(p),
      pct: Math.min(1, Math.max(0, p)),
    });
  });

  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={wrapRef}
      aria-label="Interior Design"
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-bg-alt">
        <SkyWash />

        <div className="pointer-events-none absolute inset-0">
          <InteriorScene scroll={scrollYProgress} />
        </div>

        <div className="absolute right-gutter top-[calc(var(--nav-h)+1.5rem)] z-10 hidden border border-line bg-bg/70 p-3 backdrop-blur-sm md:block">
          <p className="eyebrow text-accent">Now staging</p>
          <p className="mt-1 font-mono text-[0.68rem] leading-relaxed text-ink">
            <span className="tabular-nums">{readout.label}</span>
          </p>
          <div className="mt-2 h-px w-40 bg-line">
            <div
              className="h-px bg-accent transition-[width] duration-200 ease-out"
              style={{ width: `${readout.pct * 100}%` }}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-14">
          <motion.div style={{ opacity: copyOpacity }}>
            <Container className="relative z-10">
              <InteriorCopy />
            </Container>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10"
        >
          <Container>
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="h-px w-10 bg-ink-soft/40" />
              <span className="font-mono text-[0.68rem] uppercase tracking-wide">
                Scroll to stage
              </span>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}

export default function InteriorHero() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (mounted && reduceMotion) return <StaticInteriorHero />;
  return <ScrollInteriorHero />;
}
