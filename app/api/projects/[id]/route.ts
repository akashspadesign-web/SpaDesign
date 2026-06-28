import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { projectUpdateSchema } from "@/lib/projectSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

// Admin auth on PATCH + DELETE is enforced by middleware.
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

  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ project });
  } catch (err) {
    const notFound =
      err instanceof Error &&
      err.message.includes("Record to update not found");
    return NextResponse.json(
      { error: notFound ? "Project not found." : "Could not update project." },
      { status: notFound ? 404 : 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const notFound =
      err instanceof Error &&
      err.message.includes("Record to delete does not exist");
    return NextResponse.json(
      { error: notFound ? "Project not found." : "Could not delete project." },
      { status: notFound ? 404 : 500 },
    );
  }
}
