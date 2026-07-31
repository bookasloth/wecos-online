import { z } from "zod";
import { industries, stages } from "./constants";
import type {
  CompanyProduct,
  CompanyPerson,
  CompanyFunding,
  CompanyUpdate,
  CompanyJob,
  CompanyStat,
  CompanyTraction,
  CompanyReview,
  CompanyDocument,
  CompanySocials,
} from "@/features/startups/company-page";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const startupSchema = z.object({
  name: z.string().trim().min(2, "Enter your startup name"),
  tagline: optionalText(140),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  industry: z.enum(industries).optional(),
  stage: z.enum(stages).optional(),
  location: optionalText(80),
  description: optionalText(2000),
  logoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  foundedYear: z.number().int().min(1800).max(2100).optional(),
  teamSize: optionalText(40),
  // Studios provider listing: pick a category to list as a service provider
  // (sets offers_services + service_category); empty = not a provider.
  serviceCategory: z
    .enum(["marketing", "hr", "finance", "legal", "capital-circle", "technology"])
    .optional()
    .or(z.literal("")),
});

export type StartupValues = z.infer<typeof startupSchema>;

export type Milestone = { date: string; text: string };
export type StartupLink = { label: string; href: string };

/**
 * Rich page content, stored in the `startups.details` JSONB and merged over the
 * base columns on the public page. Phase 2 lets founders edit these three
 * sections; other CompanyPageData keys (traction, updates, jobs…) come later.
 */
export type StartupDetails = {
  products?: CompanyProduct[];
  people?: CompanyPerson[];
  funding?: CompanyFunding;
  updates?: CompanyUpdate[];
  jobs?: CompanyJob[];
  stats?: CompanyStat[];
  traction?: CompanyTraction;
  reviews?: CompanyReview[];
  documents?: CompanyDocument[];
  socials?: CompanySocials;
  /** Overview facts not backed by a base column (business type). */
  overview?: { type?: string };
};

/**
 * Persisted startup (a `space` of type 'studio') = form values + system fields.
 * Optional rich fields are populated by sample data and shown on the public
 * startup page when present (not yet in the basic edit form).
 */
export type Startup = StartupValues & {
  id: string;
  slug: string;
  foundedYear?: number;
  teamSize?: string;
  funding?: string;
  tags?: string[];
  links?: StartupLink[];
  milestones?: Milestone[];
  lookingFor?: string;
  founderHandle?: string;
  details?: StartupDetails;
  /** Studios listing application state: pending | approved | rejected. */
  studioStatus?: "pending" | "approved" | "rejected";
};
