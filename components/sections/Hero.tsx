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
import { site } from "@/lib/site";
import { FLOORS } from "@/three/constants";

// WebGL can't render on the server — load the scene only on the client.
const HeroScene = dynamic(() => import("@/three/HeroScene"), { ssr: false });

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
          "linear-gradient(180deg, transparent, rgba(232,119,26,0.06))",
      }}
    />
  </>
);

function HeroCopy() {
  return (
    <>
      <Reveal>
        <p className="eyebrow mb-6 text-center">
          Architects · Engineers · Interiors
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mx-auto max-w-[18ch] text-center text-[clamp(4rem,10vw,10.5rem)] font-light leading-[0.92] tracking-tightish text-balance">
          Renovate Your <span className="italic text-accent">Imaginations</span>
        </h1>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mx-auto mt-8 max-w-xl text-center text-lg leading-relaxed text-ink-soft sm:text-xl">
          Multi-disciplinary studio. India, since {site.foundedYear}.
        </p>
      </Reveal>
      <Reveal delay={0.26}>
        <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
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

/** Reduced-motion / no-scroll fallback: a single screen with the finished tower. */
function StaticHero() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-bg-alt pb-14 pt-nav"
    >
      <SkyWash />
      <div className="absolute inset-0">
        <HeroScene staticProgress={1} />
      </div>
      <Container className="relative z-10 pointer-events-none">
        <HeroCopy />
      </Container>
    </section>
  );
}

// Must match the phase windows in three/Blueprint, three/Wireframe, three/Building.
const PODIUM_START = 0.55;
const SOLID_START = 0.62;

type Readout = { label: string; pct: number };

function ScrollHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState<Readout>({
    label: "Drafting plans",
    pct: 0,
  });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Narrate the build phase in the readout: plans → frame → podium → floors.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let label: string;
    if (p < 0.20) label = "Drafting plans";
    else if (p < PODIUM_START) label = "Erecting frame";
    else if (p < SOLID_START) label = "Casting podium";
    else {
      const floors = Math.min(
        FLOORS,
        Math.floor(((p - SOLID_START) / (1 - SOLID_START)) * FLOORS + 0.0001),
      );
      label = `Floor ${String(floors).padStart(2, "0")} / ${FLOORS}`;
    }
    setReadout({ label, pct: Math.min(1, Math.max(0, p)) });
  });

  // Copy recedes as the tower tops out; the scroll cue fades on the first pull.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6, 0.85], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={wrapRef} aria-label="Introduction" className="relative h-[340vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-bg-alt">
        <SkyWash />

        {/* Decorative canvas — must not intercept scroll or clicks */}
        <div className="pointer-events-none absolute inset-0">
          <HeroScene scroll={scrollYProgress} />
        </div>

        {/* Construction readout — top-right */}
        <div className="absolute right-gutter top-[calc(var(--nav-h)+1.5rem)] z-10 hidden border border-line bg-bg/70 p-3 backdrop-blur-sm md:block">
          <p className="eyebrow text-accent">Now building</p>
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

        {/* Hero copy — real DOM, overlaid on the canvas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-14">
          <motion.div style={{ opacity: copyOpacity }}>
            <Container className="relative z-10">
              <HeroCopy />
            </Container>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10"
        >
          <Container>
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="h-px w-10 bg-ink-soft/40" />
              <span className="font-mono text-[0.68rem] uppercase tracking-wide">
                Scroll to build
              </span>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // The server can't know the client's reduced-motion preference, so it always
  // renders the scroll hero. We match that on the first client paint, then swap
  // to the static hero only after mount — avoiding a hydration mismatch.
  useEffect(() => setMounted(true), []);

  if (mounted && reduceMotion) return <StaticHero />;
  return <ScrollHero />;
}
