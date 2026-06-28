import { cn } from "@/lib/cn";

type SectionLabelProps = {
  index?: string;
  children: string;
  className?: string;
};

/** Small all-caps mono label, e.g. "01 / FEATURED WORK". */
export default function SectionLabel({
  index,
  children,
  className,
}: SectionLabelProps) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2", className)}>
      {index && (
        <>
          <span className="text-accent">{index}</span>
          <span aria-hidden className="text-ink-soft/50">
            /
          </span>
        </>
      )}
      {children}
    </span>
  );
}
