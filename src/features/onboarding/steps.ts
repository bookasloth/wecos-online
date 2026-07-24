import type { Step } from "@/components/patterns/step-rail";

/**
 * Onboarding asks for three things, and only things the product actually uses:
 *
 * 1. Identity + city  — the city drives Coffee Club chapter matching
 * 2. Focus            — which studios they need; the Studios lead signal, captured
 *                       at the moment of highest intent
 * 3. Venture          — optional, because "still exploring" is a real answer
 *
 * Anything we would not act on does not belong here. Bio, avatar and links are
 * editable later from the profile, where there is no cost to skipping them.
 */
export const onboardingSteps: Step[] = [
  { id: "profile", label: "About you", hint: "Name, city and your WeCos link" },
  { id: "focus", label: "What you need", hint: "So we point you at the right people" },
  { id: "venture", label: "Your venture", hint: "Optional — skip if you're still exploring" },
];

/** Founder stage — shapes what we surface first. */
export const stages = [
  { id: "idea", label: "Idea", hint: "Exploring a problem" },
  { id: "building", label: "Building", hint: "Pre-launch" },
  { id: "launched", label: "Launched", hint: "Live with users" },
  { id: "growing", label: "Growing", hint: "Revenue and scaling" },
] as const;
