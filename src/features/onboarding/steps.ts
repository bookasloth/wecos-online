import type { Step } from "@/components/patterns/step-rail";

/**
 * Five easy steps. Two are framing screens (Welcome, Done) and three collect
 * data — and only data the product acts on:
 *
 * 1. Welcome  — sets expectations, no input
 * 2. About you — identity + city; the city drives Coffee Club chapter matching
 * 3. What you need — which studios they need; the Studios lead signal, captured
 *                    at the moment of highest intent
 * 4. Company  — optional, because "still exploring" is a real answer
 * 5. Done     — profile is live; point them at the first useful action
 *
 * Anything we would not act on does not belong in the data steps. Bio, avatar
 * and links stay editable later from the profile, where skipping costs nothing.
 */
export const onboardingSteps: Step[] = [
  { id: "welcome", label: "Welcome", hint: "What the next minute looks like" },
  { id: "profile", label: "About you", hint: "Name, city and your WeCos link" },
  { id: "focus", label: "What you need", hint: "So we point you at the right people" },
  { id: "company", label: "Your company", hint: "Optional — skip if you're still exploring" },
  { id: "done", label: "Done", hint: "Your profile is live" },
];

/** Founder stage — shapes what we surface first. */
export const stages = [
  { id: "idea", label: "Idea", hint: "Exploring a problem" },
  { id: "building", label: "Building", hint: "Pre-launch" },
  { id: "launched", label: "Launched", hint: "Live with users" },
  { id: "growing", label: "Growing", hint: "Revenue and scaling" },
] as const;
