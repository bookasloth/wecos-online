import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Coffee,
  Compass,
  Crown,
  Leaf,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { pricing, entryTier, tiers, studioDiscountPct, cities } from "@/config/site";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const problems = [
  {
    icon: Lightbulb,
    problem: "Idea Confusion",
    solution: "Validation Engine — AI feedback paired with mentor insight.",
  },
  {
    icon: Compass,
    problem: "Execution Chaos",
    solution: "Growth Toolkit — structured templates, trackers and playbooks.",
  },
  {
    icon: Users,
    problem: "Founder Isolation",
    solution: "Coffee Clubs — real people, real support, every month.",
  },
  {
    icon: BadgeCheck,
    problem: "No Credibility",
    solution: "Founder Page — your public proof of progress.",
  },
  {
    icon: Leaf,
    problem: "Burnout",
    solution: "Calm System — focus, reflection and balanced growth.",
  },
];

const steps = [
  {
    title: "Validate",
    body: "Get your idea reviewed by our Validation Engine. Receive a custom score, feedback and 3 actionable next steps.",
  },
  {
    title: "Build",
    body: "Access the Growth Toolkit: Notion systems, launch templates, OKR trackers and pitch-deck builders. Progress visibly, not chaotically.",
  },
  {
    title: "Belong",
    body: "Join your city's Coffee Club — meet other founders offline, find partners and stay consistent with community accountability.",
  },
];
const stepImages = [
    "/validate.png",
    "/build.png",
  "/belong.png",
];

/**
 * Marketing copy for the paid tiers. Names and prices come from `tiers` in
 * config/site.ts — only the sales bullets live here, so the homepage can never
 * drift from what the product actually charges.
 *
 * (It previously did: this section hardcoded "Studio / Network / Package" at
 * ₹499 / ₹1,299 / ₹1,499 **per month**, against annual tiers of
 * ₹499 / ₹1,299 / ₹1,999.)
 */
const planCopy: Record<string, { icon: typeof Rocket; description: string; features: string[]; cta: string }> = {
  network: {
    icon: Users,
    description: "For founders who want to be known and reachable.",
    features: [
      "Everything in Free",
      "Unlimited connections and messages",
      "See who viewed your profile",
      "Full profile — skills, links, work history",
      `${studioDiscountPct.network}% off every studio package`,
    ],
    cta: "Join Solo",
  },
  venture: {
    icon: Rocket,
    description: "For founders who want customers to find them.",
    features: [
      "Everything in Solo",
      "List your startup in the directory",
      "Collect leads, with a lead inbox",
      "List your business as a studio provider",
      `${studioDiscountPct.venture}% off every studio package`,
      "One call with the WeCos founder",
    ],
    cta: "Get found",
  },
  circle: {
    icon: Star,
    description: "For founders who want to lead the community.",
    features: [
      "Everything in Venture",
      "Create events and host a Coffee Club",
      "Free entry to every masterclass",
      `${studioDiscountPct.circle}% off every studio package`,
      "Partner brand perks and credits",
      "Featured placement everywhere",
    ],
    cta: "Join Studio",
  },
};

const pricingPlans = tiers
  .filter((t) => t.priceInr > 0)
  .map((t) => ({
    id: t.id,
    name: t.name,
    price: t.priceInr,
    highlighted: "featured" in t && t.featured === true,
    ...planCopy[t.id],
  }));

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="grid gap-12 py-5 text-center sm:py-8 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Limited to the first {pricing.foundingSeats} founding members
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
              Build Better. Prove Faster.
              <span className="block text-primary">Grow Stronger.</span>
            </h1>

            <p className="mt-4 text-xl font-semibold text-foreground">
              With India&apos;s Ultimate Startup Engine.
            </p>

            <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
              WeCos helps founders turn ideas into real, validated startups —
              powered by AI systems and guided by human mentors.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-12 w-full px-7 text-base sm:w-auto"
                )}
              >
                I Have an Idea
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/membership"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 w-full px-7 text-base sm:w-auto"
                )}
              >
                I Already Have a Startup
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Join 500+ founders building calmly — one clear step at a time.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
            />

            <img
              src="/hero-img.png"
              alt="WeCos startup community"
              className="w-full max-w-md sm:max-w-xl lg:max-w-3xl xl:max-w-4xl object-contain"
            />
          </div>
        </Container>
      </section>

      {/* Why founders choose WeCos */}
      <section className="border-t border-border/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why WeCos"
            title="We don't build in chaos. We build with clarity."
            subtitle="Modern founders juggle 20 tools, dozens of opinions and endless noise. WeCos brings everything together — one calm engine for real progress."
          />

          <div className="mt-12 space-y-6">
            {/* First row: 3 cards */}
            <div className="grid gap-6 lg:grid-cols-3">
              {problems.slice(0, 3).map(({ icon: Icon, problem, solution }, index) => (
                <div
                  key={problem}
                  className="group relative min-h-[210px] overflow-hidden rounded-[26px] border border-border bg-card px-6 py-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
                >
                  <span className="absolute right-6 top-5 text-4xl font-extrabold text-muted-foreground/20 transition-colors group-hover:text-primary/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                    {problem}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                    {solution}
                  </p>
                </div>
              ))}
            </div>

            {/* Second row: 2 centered cards */}
            <div className="grid gap-6 lg:mx-auto lg:max-w-[760px] lg:grid-cols-2">
              {problems.slice(3).map(({ icon: Icon, problem, solution }, index) => (
                <div
                  key={problem}
                  className="group relative min-h-[210px] overflow-hidden rounded-[26px] border border-border bg-card px-6 py-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
                >
                  <span className="absolute right-6 top-5 text-5xl font-extrabold text-muted-foreground/20 transition-colors group-hover:text-primary/20">
                    {String(index + 4).padStart(2, "0")}
                  </span>

                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                    {problem}
                  </h3>

                  <p className="mt-2 max-w-sm text-base leading-relaxed text-muted-foreground">
                    {solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-background py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Three calm steps from <br className="hidden sm:block" />
              idea to momentum.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group rounded-[24px] border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)]"
              >
                <span className="font-mono text-xl font-bold text-primary">
                  0{i + 1}
                </span>

                <div className="mt-4 flex justify-center">
                  <img
                    src={stepImages[i]}
                    alt={step.title}
                    className="h-[180px] w-[180px] object-contain"
                  />
                </div>

                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Plans */}
      <section className="border-t border-border/60 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Pick the plan that fits your stage."
            subtitle="Annual, and free to start. Every paid tier includes everything below it."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map(({ id, name, icon: Icon, price, description, features, cta, highlighted }) => (
              <div
                key={id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-300",
                  highlighted
                    ? "border-primary/40 shadow-[0_24px_70px_rgba(124,58,237,0.15)]"
                    : "border-border shadow-[0_14px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(124,58,237,0.1)]"
                )}
              >
                <div className="flex items-center justify-between p-8 pb-6">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  {highlighted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-2xs font-bold text-primary">
                      <Crown className="size-3.5" />
                      Recommended
                    </span>
                  ) : null}
                </div>

                <div className="px-8 pb-6">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>

                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {inr(price)}
                    </span>
                    <span className="pb-1 text-primary">/year</span>
                  </div>
                </div>

                <div className="flex-1 border-t border-border p-8">
                  <ul className="grid gap-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 pt-6">
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ variant: highlighted ? "default" : "outline" }),
                      cn(
                        "h-12 w-full text-base",
                        highlighted && "bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(124,58,237,0.25)] hover:bg-primary/90"
                      )
                    )}
                  >
                    {cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Coffee Clubs */}
      <section className="border-t border-border/60 bg-muted/30 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Coffee Clubs"
            title="Because great ideas deserve real conversations."
            subtitle="Monthly city meetups where founders discuss progress, problems and plans — over coffee, not chaos."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/coffee-clubs/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <Coffee className="size-3.5 text-primary" />
                {c.name}
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/coffee-clubs"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Find a Coffee Club near you
            </Link>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div
            className="relative overflow-hidden rounded-[28px] px-6 py-16 text-center text-white sm:px-12"
            style={{
              background:
                "radial-gradient(circle at 0% 100%, rgba(6,182,212,0.95) 0%, rgba(6,182,212,0.45) 16%, transparent 34%), radial-gradient(circle at 100% 0%, rgba(217,70,239,0.95) 0%, rgba(217,70,239,0.45) 18%, transparent 36%), linear-gradient(135deg, #050617 0%, #08051f 45%, #16051f 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/10" />

            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />

            <div className="absolute -right-24 bottom-[-95px] h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-16 bottom-[-65px] h-56 w-56 rounded-full border border-white/10" />

            <div className="relative z-10">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                You&apos;ve got the spark.
                <span className="block">We&apos;ll give you the engine.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-white/80">
                Get validation, clarity and community — membership from{" "}
                {inr(entryTier.priceInr)}/year.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-12 rounded-xl bg-primary px-7 text-base text-primary-foreground shadow-[0_12px_30px_rgba(124,58,237,0.35)] hover:bg-primary/90",
                  )}
                >
                  Start My Engine
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <p className="mt-5 text-sm text-white/70">
                First {pricing.foundingSeats} founders get lifetime recognition on the
                WeCos Wall of Builders.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
