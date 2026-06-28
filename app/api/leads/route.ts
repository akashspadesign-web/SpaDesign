import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { leadCreateSchema } from "@/lib/leadSchema";

// Use Node runtime — Prisma client doesn't run on Edge.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("[leads.POST] received submission");
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    console.warn("[leads.POST] invalid JSON body");
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    console.warn(
      "[leads.POST] zod validation failed:",
      parsed.error.flatten().fieldErrors,
    );
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot: silently accept-and-discard. Bots get a 201, humans don't fill it.
  if (parsed.data.contact_time && parsed.data.contact_time.length > 0) {
    console.warn(
      "[leads.POST] honeypot tripped (contact_time filled) — discarding without save",
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Empty strings from optional form fields → null in the DB.
  // `contact_time` is the honeypot; intentionally not persisted.
  const data = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    projectType: parsed.data.projectType,
    budget: parsed.data.budget || null,
    location: parsed.data.location || null,
    message: parsed.data.message,
  };

  try {
    const lead = await prisma.lead.create({ data });
    console.log(
      `[leads.POST] saved id=${lead.id} email=${lead.email} type=${lead.projectType}`,
    );
    return NextResponse.json(
      { id: lead.id, createdAt: lead.createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error("[leads.POST] Prisma create failed:", err);
    return NextResponse.json(
      { error: "Could not save your inquiry. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Auth is enforced by middleware before we reach here.
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ leads });
}
