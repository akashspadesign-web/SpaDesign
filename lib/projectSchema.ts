import { z } from "zod";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/projects";

const trimmed = (min: number, max: number, msg?: string) =>
  z.string().trim().min(min, msg).max(max);

/** Shape accepted by POST /api/projects and the admin "new" form. */
export const projectCreateSchema = z.object({
  name: trimmed(2, 160, "Title is required."),
  category: z.enum(PROJECT_CATEGORIES, {
    message: "Please choose a category.",
  }),
  location: trimmed(2, 160, "Location is required."),
  description: z.string().trim().max(800).optional(),
  image: trimmed(1, 400, "Image path is required.")
    .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), {
      message: "Use a /public path (e.g. /projects/foo.jpg) or a full URL.",
    }),
  area: z.string().trim().max(40).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  featured: z.boolean().optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

/** Same fields, all optional — used for PATCH /api/projects/[id]. */
export const projectUpdateSchema = projectCreateSchema.partial();
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
