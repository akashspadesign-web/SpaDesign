// Types + constants for the project portfolio.
// Project data now lives in the SQLite DB (see prisma/schema.prisma).
// Server code reads/writes via lib/projects-repo.ts.

export const PROJECT_CATEGORIES = [
  "Institutional",
  "Commercial",
  "Hotel",
  "IT Park",
  "Industrial",
  "Residential",
  "Worship / Other",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = [
  "Completed",
  "Under Construction",
  "Proposed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Re-exported from Prisma so callers can `import type { Project } from "@/lib/projects"`. */
export type { Project } from "@prisma/client";

/** Back-compat alias kept for existing imports. */
export const projectCategories = PROJECT_CATEGORIES;

/**
 * `slug` is auto-generated from the title on create. Kept here so the admin
 * form and any future detail route share one implementation.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function isProjectCategory(v: unknown): v is ProjectCategory {
  return (
    typeof v === "string" &&
    (PROJECT_CATEGORIES as readonly string[]).includes(v)
  );
}

export function isProjectStatus(v: unknown): v is ProjectStatus {
  return (
    typeof v === "string" &&
    (PROJECT_STATUSES as readonly string[]).includes(v)
  );
}
