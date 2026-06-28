import Link from "next/link";

export default function ContactCTA() {
  const phrase = "Let's talk";
  const sep = "·";
  const items = Array.from({ length: 8 });

  return (
    <section className="bg-accent text-ink">
      <Link
        href="/contact"
        aria-label="Contact us, let's talk"
        className="group block overflow-hidden py-6 sm:py-8"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
          {/* Rendered twice for a seamless -50% loop */}
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {items.map((_, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-5 font-serif text-2xl font-light tracking-tightish sm:text-3xl lg:text-4xl">
                    {phrase}
                  </span>
                  <span className="font-serif text-xl text-ink/40 sm:text-2xl">
                    {sep}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </Link>
    </section>
  );
}
