"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Project = {
  slug: string;
  title: string;
  subtitle: string;
  render: string;
  gallery: string[];
};

const PROJECTS: Project[] = [
  {
    slug: "blackboard-education",
    title: "Blackboard College Vidya",
    subtitle: "Education & Research Foundation",
    render: "/projects/blackboard-education/render.jpg",
    gallery: [
      "/projects/blackboard-education/render.jpg",
      "/projects/blackboard-education/site-1.jpg",
      "/projects/blackboard-education/site-2.jpg",
      "/projects/blackboard-education/site-3.jpg",
      "/projects/blackboard-education/site-4.jpg",
    ],
  },
  {
    slug: "alps-technosystem",
    title: "ALPS Technosystem",
    subtitle: "Industrial & Office Facility",
    render: "/projects/alps-technosystem/render.jpg",
    gallery: [
      "/projects/alps-technosystem/render.jpg",
      "/projects/alps-technosystem/site-1.jpg",
      "/projects/alps-technosystem/site-2.jpg",
      "/projects/alps-technosystem/site-3.jpg",
      "/projects/alps-technosystem/site-4.jpg",
    ],
  },
  {
    slug: "sagar-motors",
    title: "Sagar Motors",
    subtitle: "Tata Motors Dealership",
    render: "/projects/sagar-motors/render.jpg",
    gallery: [
      "/projects/sagar-motors/render.jpg",
      "/projects/sagar-motors/site-1.jpg",
      "/projects/sagar-motors/site-2.jpg",
      "/projects/sagar-motors/site-3.jpg",
      "/projects/sagar-motors/site-4.jpg",
    ],
  },
];

export default function ProjectsShowcase() {
  const [active, setActive] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);

  const open = (p: Project) => {
    setActive(p);
    setIndex(0);
  };
  const close = useCallback(() => setActive(null), []);

  // Warm the browser cache with the full gallery on hover/focus so the
  // lightbox opens instantly when the card is actually clicked.
  const preload = (p: Project) =>
    p.gallery.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

  const next = useCallback(() => {
    if (active) setIndex((i) => (i + 1) % active.gallery.length);
  }, [active]);
  const prev = useCallback(() => {
    if (active)
      setIndex((i) => (i - 1 + active.gallery.length) % active.gallery.length);
  }, [active]);

  // Esc to close, arrows to navigate, lock body scroll while open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  return (
    <section id="projects" className="py-section">
      <div className="mx-auto w-full max-w-content px-gutter">
        <div className="mb-12 text-center">
          <h2 className="text-h2 font-light tracking-tightish leading-tight text-ink text-balance">
            Our Projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            From design to delivery. Hover to explore, click to see it being
            built.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <button
              key={p.slug}
              onClick={() => open(p)}
              onMouseEnter={() => preload(p)}
              onFocus={() => preload(p)}
              className="group relative block w-full overflow-hidden bg-bg-alt text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.render}
                  alt={`${p.title}, completed building render`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                  className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 right-4 translate-y-2 font-mono text-xs uppercase tracking-wide text-bg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View construction →
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-xl tracking-tightish text-ink">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{p.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title}, gallery`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-md"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="fixed right-4 top-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-bg/95 text-ink shadow-lg transition hover:bg-bg"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
              <Image
                src={active.gallery[index]}
                alt={`${active.title}, image ${index + 1}`}
                fill
                sizes="100vw"
                unoptimized
                className="object-contain"
              />
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 px-3 py-2 text-bg transition-colors hover:bg-ink/70"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ink/50 px-3 py-2 text-bg transition-colors hover:bg-ink/70"
              >
                ›
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/50 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-bg">
                {index === 0
                  ? "Completed render"
                  : `Construction ${index} / ${active.gallery.length - 1}`}
              </span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {active.gallery.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setIndex(i)}
                  aria-label={`Open image ${i + 1}`}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden ring-2 transition ${
                    i === index
                      ? "ring-accent"
                      : "ring-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <p className="mt-3 text-center font-mono text-xs uppercase tracking-wide text-bg/80">
              {active.title}, {active.subtitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
