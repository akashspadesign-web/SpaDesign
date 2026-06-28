import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import StatusSelect from "@/components/admin/StatusSelect";
import StatusBadge from "@/components/admin/StatusBadge";
import type { LeadStatus } from "@/lib/leadSchema";

export const dynamic = "force-dynamic";

function fmtFull(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) notFound();

  const status = (lead.status as LeadStatus) ?? "NEW";

  return (
    <div>
      <Link
        href="/admin/leads"
        className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
      >
        ← All leads
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Main */}
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-serif text-4xl tracking-tightish text-ink">
              {lead.name}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
            Submitted {fmtFull(lead.createdAt)}
          </p>

          <section className="mt-10 border-t border-line pt-8">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
              Project Brief
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink text-pretty">
              {lead.message}
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:border-l lg:border-line lg:pl-10">
          <div className="border border-line bg-bg p-6">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
              Status
            </h2>
            <div className="mt-3">
              <StatusSelect leadId={lead.id} initial={status} />
            </div>
          </div>

          <dl className="mt-8 grid gap-6 text-sm">
            <Row label="Email">
              <a
                href={`mailto:${lead.email}`}
                className="link-underline text-ink"
              >
                {lead.email}
              </a>
            </Row>
            {lead.phone && (
              <Row label="Phone">
                <a
                  href={`tel:${lead.phone}`}
                  className="link-underline text-ink"
                >
                  {lead.phone}
                </a>
              </Row>
            )}
            <Row label="Project type">{lead.projectType}</Row>
            {lead.budget && <Row label="Budget">{lead.budget}</Row>}
            {lead.location && <Row label="Location">{lead.location}</Row>}
            <Row label="Lead ID">
              <span className="break-all font-mono text-[0.72rem] text-ink-soft">
                {lead.id}
              </span>
            </Row>
            <Row label="Last updated">
              <span className="font-mono text-[0.72rem] text-ink-soft">
                {fmtFull(lead.updatedAt)}
              </span>
            </Row>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-3">
      <dt className="font-mono text-[0.66rem] uppercase tracking-wide text-ink-soft">
        {label}
      </dt>
      <dd className="mt-1 text-base text-ink">{children}</dd>
    </div>
  );
}
