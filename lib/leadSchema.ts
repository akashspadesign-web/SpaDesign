import { z } from "zod";

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CLOSED",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PROJECT_TYPES = [
  "Architecture",
  "Interior Design",
  "Consultation",
  "Other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const BUDGET_RANGES = [
  "Under ₹25 Lakhs",
  "₹25 – 75 Lakhs",
  "₹75 Lakhs – 2 Cr",
  "₹2 – 10 Cr",
  "₹10 Cr+",
  "Prefer not to say",
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

/**
 * Optional fields accept either a populated string or the empty string. The
 * route handler converts "" → null before persisting, so we don't store
 * meaningless empty strings.
 */
export const leadCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email."),
  phone: z
    .union([
      z.literal(""),
      z.string().trim().min(6, "Phone number looks too short.").max(20),
    ])
    .optional(),
  projectType: z.enum(PROJECT_TYPES, {
    message: "Please choose a project type.",
  }),
  budget: z.union([z.literal(""), z.enum(BUDGET_RANGES)]).optional(),
  location: z
    .union([z.literal(""), z.string().trim().max(120)])
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, "Please share a few sentences about your project.")
    .max(4000, "Message is too long — please keep it under 4000 characters."),
  /**
   * Honeypot. Named to avoid attracting browser autofill / password managers
   * (they target `email`, `name`, `website`, `url`, etc.). Client-side this
   * accepts any string so an over-eager autofill never blocks a real
   * submission — the route handler is the one that treats a non-empty value
   * as bot traffic.
   */
  contact_time: z.string().optional(),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export const leadStatusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};
