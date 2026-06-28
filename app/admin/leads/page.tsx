import Link from "next/link";
import { prisma } from "@/lib/db";
import StatusSelect from "@/components/admin/StatusSelect";
import {
  LEAD_STATUSES,
  STATUS_LABEL,
  type LeadStatus,
} from "@/lib/leadSchema";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newThisWeek = leads.filter((l) => l.createdAt >= oneWeekAgo).length;

  const counts: Record<LeadStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    IN_PROGRESS: 0,
    CLOSED: 0,
  };
  for (const l of leads) {
    counts[(l.status as LeadStatus) ?? "NEW"] =
      (counts[(l.status as LeadStatus) ?? "NEW"] ?? 0) + 1;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            Inquiries
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tightish text-ink">
            Leads
          </h1>
        </div>
        <p className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
          {leads.length} total · {newThisWeek} new this week
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total" value={leads.length} />
        <Stat label="New this week" value={newThisWeek} accent />
        {LEAD_STATUSES.map((s) => (
          <Stat key={s} label={STATUS_LABEL[s]} value={counts[s]} />
        ))}
      </div>

      {/* Table */}
      <div className="mt-12 border border-line bg-bg">
        {leads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-2xl text-ink-soft">No leads yet.</p>
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft/70">
              Submissions from /start-project will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-alt">
                <tr className="border-b border-line">
                  <Th>When</Th>
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  <Th>Project</Th>
                  <Th>Budget</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const status = (l.status as LeadStatus) ?? "NEW";
                  const isNew = status === "NEW";
                  return (
                    <tr
                      key={l.id}
                      className={`border-b border-line align-top last:border-b-0 ${
                        isNew ? "bg-accent/[0.04]" : ""
                      }`}
                    >
                      <Td>
                        <span className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
                          {timeAgo(l.createdAt)}
                        </span>
                        {isNew && (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                        )}
                      </Td>
                      <Td>
                        <Link
                          href={`/admin/leads/${l.id}`}
                          className="font-serif text-base text-ink hover:text-accent"
                        >
                          {l.name}
                        </Link>
                      </Td>
                      <Td>
                        <a
                          href={`mailto:${l.email}`}
                          className="block text-sm text-ink hover:text-accent"
                        >
                          {l.email}
                        </a>
                        {l.phone && (
                          <a
                            href={`tel:${l.phone}`}
                            className="block text-xs text-ink-soft hover:text-accent"
                          >
                            {l.phone}
                          </a>
                        )}
                      </Td>
                      <Td>
                        <span className="text-sm text-ink">
                          {l.projectType}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm text-ink-soft">
                          {l.budget ?? "—"}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm text-ink-soft">
                          {l.location ?? "—"}
                        </span>
                      </Td>
                      <Td>
                        <StatusSelect leadId={l.id} initial={status} />
                      </Td>
                      <Td>
                        <Link
                          href={`/admin/leads/${l.id}`}
                          className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
                        >
                          Open →
                        </Link>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function Th({ children, ...rest }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...rest}
      className="px-4 py-3 font-mono text-[0.62rem] uppercase tracking-wide text-ink-soft"
    >
      {children}
    </th>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-bg p-5">
      <p className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-2 font-serif text-3xl tracking-tightish ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
