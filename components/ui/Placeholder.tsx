import { cn } from "@/lib/cn";

type PlaceholderProps = {
  label: string;
  /** e.g. "1920 × 1080" — baked-in target dimensions for the client. */
  dimensions?: string;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  ratioClassName?: string;
  className?: string;
  note?: string;
};

/**
 * A clearly-labelled image placeholder. Used wherever client renders are not
 * yet supplied — never a random stock image. Shows the intended dimensions so
 * the asset can be dropped in 1:1 later.
 */
export default function Placeholder({
  label,
  dimensions,
  ratioClassName = "aspect-[4/3]",
  className,
  note = "Awaiting client render",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-bg-alt text-center",
        ratioClassName,
        className,
      )}
    >
      {/* hairline cross-hatch to read as a deliberate placeholder */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 11px, var(--color-line) 11px, var(--color-line) 12px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-1.5 px-6">
        <span className="eyebrow text-accent">{note}</span>
        <span className="font-serif text-lg leading-tight text-ink/80 text-balance">
          {label}
        </span>
        {dimensions && (
          <span className="mt-1 font-mono text-[0.7rem] tracking-wide text-ink-soft/70">
            {dimensions}
          </span>
        )}
      </div>
    </div>
  );
}
