import Image from "next/image";
import Container from "@/components/ui/Container";

type TrustedLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Miniso's mark is white — render it on the brand red so it reads. */
  bgClassName?: string;
};

const TRUSTED: TrustedLogo[] = [
  { name: "Tata Motors", src: "/trusted/tata-motors.png", width: 381, height: 332 },
  { name: "BigBasket", src: "/trusted/bigbasket.png", width: 807, height: 179 },
  { name: "Choice Hotels", src: "/trusted/choice-hotels.png", width: 327, height: 84 },
  { name: "Miniso", src: "/trusted/miniso.png", width: 386, height: 240, bgClassName: "bg-[#e60012]" },
  { name: "Shiv Nadar University", src: "/trusted/shiv-nadar-university.png", width: 501, height: 108 },
];

/**
 * Seamless auto-scroll marquee — the logo set is rendered twice, animated
 * translateX(0 → -50%) so the duplicate slides in without a visible jump.
 * `prefers-reduced-motion: reduce` already kills the animation via globals.css
 * (universal selector inside the reduce-motion media query).
 */
export default function Press() {
  return (
    <section className="border-y border-line bg-bg-alt py-section">
      <Container>
        <h2 className="text-center font-serif text-h2 font-light leading-tight tracking-tightish text-ink">
          Trusted by
        </h2>

        <div className="group mt-14 overflow-hidden">
          <div className="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <ul
                key={dup}
                aria-hidden={dup === 1 ? true : undefined}
                className="flex flex-shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10"
              >
                {TRUSTED.map((logo) => (
                  <li
                    key={`${logo.name}-${dup}`}
                    className={`flex h-36 w-64 items-center justify-center px-6 sm:h-44 sm:w-72 sm:px-8 ${logo.bgClassName ?? "bg-bg"} border border-line`}
                  >
                    <Image
                      src={logo.src}
                      alt={dup === 0 ? logo.name : ""}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                      className="max-h-24 w-auto object-contain sm:max-h-28"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
