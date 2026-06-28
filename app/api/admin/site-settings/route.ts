import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  FOUNDER_PHOTO_DEFAULT,
  getFounderPhotoUrl,
  resetFounderPhotoUrl,
  setFounderPhotoUrl,
} from "@/lib/settings-repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin auth is enforced by middleware.ts before we reach here.

const patchSchema = z.object({
  founderPhotoUrl: z
    .string()
    .trim()
    .min(1, "URL/path is required.")
    .max(400)
    .refine(
      (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
      { message: 'Use a /public path (e.g. "/images/founders.jpg") or a full URL.' },
    ),
});

export async function GET() {
  const founderPhotoUrl = await getFounderPhotoUrl();
  return NextResponse.json({
    founderPhotoUrl,
    isDefault: founderPhotoUrl === FOUNDER_PHOTO_DEFAULT,
    defaultUrl: FOUNDER_PHOTO_DEFAULT,
  });
}

export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const url = await setFounderPhotoUrl(parsed.data.founderPhotoUrl);
  return NextResponse.json({ founderPhotoUrl: url });
}

export async function DELETE() {
  await resetFounderPhotoUrl();
  return NextResponse.json({
    founderPhotoUrl: FOUNDER_PHOTO_DEFAULT,
    isDefault: true,
  });
}
