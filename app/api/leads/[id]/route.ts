import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { leadStatusUpdateSchema } from "@/lib/leadSchema";

export const runtime = "nodejs";

// Auth on this route is enforced by middleware.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = leadStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid status.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ lead });
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("Record to update not found")
        ? "Lead not found."
        : "Could not update lead.";
    const status = message === "Lead not found." ? 404 : 500;
    if (status === 500) console.error("PATCH /api/leads/[id] failed:", err);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  return NextResponse.json({ lead });
}
