import { NextResponse, type NextRequest } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { extname, basename, join } from "node:path";

// Node runtime — fs/promises is not available on Edge.
export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// Admin auth is enforced by middleware.ts before we reach this handler.
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data with a `file` field." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are accepted." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB).` },
      { status: 413 },
    );
  }

  // Derive a safe filename: <kebab-base>-<timestamp>.<ext>.
  const rawExt = extname(file.name || "").toLowerCase();
  const ext = ALLOWED_EXT.has(rawExt) ? rawExt : ".jpg";
  const rawBase = basename(file.name || "upload", rawExt || undefined)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const safeBase = rawBase || "upload";
  const filename = `${safeBase}-${Date.now()}${ext}`;

  const dir = join(process.cwd(), "public", "projects");
  try {
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, filename), buf);
  } catch (err) {
    console.error("[upload.POST] write failed:", err);
    return NextResponse.json(
      { error: "Could not save the file. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: `/projects/${filename}` }, { status: 201 });
}
