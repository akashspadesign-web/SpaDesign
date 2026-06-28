import { cn } from "@/lib/cn";
import { STATUS_LABEL, type LeadStatus } from "@/lib/leadSchema";

const COLOR: Record<LeadStatus, string> = {
  NEW: "bg-accent/15 text-accent border-accent/40",
  CONTACTED: "bg-ink/8 text-ink border-ink/30",
  IN_PROGRESS: "bg-bg border-ink/40 text-ink",
  CLOSED: "bg-ink/5 text-ink-soft border-line",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wide",
        COLOR[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
