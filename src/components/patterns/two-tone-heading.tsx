import { cn } from "@/lib/utils";

/**
 * Two-tone page heading — a muted lead-in followed by the emphasised subject.
 *
 *   <TwoToneHeading lead="Welcome back," strong="founder" />
 *   → "Welcome back," in muted regular, "founder" in solid semibold
 *
 * Borrowed from Razorpay's onboarding, where it does a lot of work for very
 * little: the sentence reads naturally while the eye still lands on the noun.
 * Cheaper than an eyebrow + heading pair and takes half the vertical space.
 *
 * `as` lets a section use it at h2 without breaking the heading hierarchy.
 */
export function TwoToneHeading({
  lead,
  strong,
  as: Tag = "h1",
  className,
}: {
  lead: string;
  strong: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "text-3xl leading-tight font-normal tracking-tight text-balance text-muted-foreground sm:text-4xl",
        className,
      )}
    >
      {lead}{" "}
      <span className="font-semibold text-foreground">{strong}</span>
    </Tag>
  );
}
