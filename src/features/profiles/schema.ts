import { z } from "zod";

/** Optional free-text field that accepts "" (empty) as "not set". */
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  headline: optionalText(120),
  location: optionalText(80),
  bio: optionalText(500),
  avatarUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  /** Coffee Club city — a `cities` slug. Drives chapter matching. */
  citySlug: optionalText(40),
  /** Studio slugs the founder wants help with. The Studios lead signal. */
  needs: z.array(z.string()).optional(),
  /** Where the founder is in their journey. Shapes what we surface. */
  stage: optionalText(40),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export type SocialLink = { label: string; href: string };

/**
 * Persisted profile = form values + system fields. The optional rich fields
 * are not edited via the basic form yet — they're populated by sample data and
 * shown on the public founder page when present.
 */
export type Profile = ProfileValues & {
  id: string;
  email: string;
  handle: string;
  skills?: string[];
  links?: SocialLink[];
  openTo?: string;
  startupSlug?: string;
};
