import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { projectCreateSchema } from "@/lib/projectSchema";
import { slugify } from "@/lib/projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  // Admin auth is enforced by middleware before we reach here.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Auto-generate a unique slug from the title; append -1, -2, … on collision.
  const base = slugify(parsed.data.name) || "project";
  let slug = base;
  for (let n = 1; ; n++) {
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${base}-${n}`;
    if (n > 50) {
      return NextResponse.json(
        { error: "Could not derive a unique slug for that title." },
        { status: 409 },
      );
    }
  }

  try {
    const project = await prisma.project.create({
      data: {
        slug,
        name: parsed.data.name,
        category: parsed.data.category,
        location: parsed.data.location,
        image: parsed.data.image,
        description: parsed.data.description ?? "",
        area: parsed.data.area ?? "",
        status: parsed.data.status ?? "Completed",
        featured: parsed.data.featured ?? false,
      },
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error("[projects.POST] create failed:", err);
    return NextResponse.json(
      { error: "Could not save the project. Please try again." },
      { status: 500 },
    );
  }
}
