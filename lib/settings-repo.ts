import "server-only";
import { prisma } from "@/lib/db";

/** Well-known keys for the SiteSetting table. Keep this list short and explicit. */
export const SETTING_KEYS = {
  founderPhotoUrl: "founder_photo_url",
} as const;

/** Default founder photo if the admin hasn't overridden it. */
export const FOUNDER_PHOTO_DEFAULT = "/images/founders.jpg";

export async function getFounderPhotoUrl(): Promise<string> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: SETTING_KEYS.founderPhotoUrl },
  });
  const stored = row?.value?.trim();
  return stored && stored.length > 0 ? stored : FOUNDER_PHOTO_DEFAULT;
}

export async function setFounderPhotoUrl(url: string): Promise<string> {
  const trimmed = url.trim();
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEYS.founderPhotoUrl },
    create: { key: SETTING_KEYS.founderPhotoUrl, value: trimmed },
    update: { value: trimmed },
  });
  return trimmed;
}

export async function resetFounderPhotoUrl(): Promise<void> {
  await prisma.siteSetting.deleteMany({
    where: { key: SETTING_KEYS.founderPhotoUrl },
  });
}
