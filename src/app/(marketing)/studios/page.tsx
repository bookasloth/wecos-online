import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { studios, memberDiscountPct, entryTier } from "@/config/site";

export const metadata: Metadata = {
  title: "Studios",
  description:
    "WeCos Studios — marketing, HR, finance, legal, capital and technology teams that work exclusively for WeCos founders.",
  alternates: { canonical: "/studios" },
};

const howItWorks = [
  {
    step: "01",
    title: "Tell us what you need",
    body: "One short enquiry. No forms with twelve fields, no discovery call to book a discovery call.",
  },
  {
    step: "02",
    title: "Get scope and a quote",
    body: "Within one working day: what we'd do, how long it takes, what it costs. Fixed, not hourly.",
  },
  {
    step: "03",
    title: "The studio starts",
    body: "A team that already knows your startup — because they can see your WeCos profile.",
  },
];

export default function StudiosPage() {
  return (
    <>
      <Container className="py-16 sm:py-24">
        <p className="text-2xs font-medium tracking-[1px] text-primary uppercase">
          WeCos Studios
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-normal tracking-tight text-balance sm:text-5xl">
          The team you&apos;d hire, without the hiring.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Six in-house studios that work exclusively for WeCos founders. Fixed scope,
          fixed price, and{" "}
          <span className="font-medium text-foreground">
            up to {memberDiscountPct}% off every package
          </span>{" "}
          if you&apos;re a member.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#studios"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Browse the studios
          </Link>
          <Link
            href="/membership"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Membership from {formatInr(entryTier.priceInr)}/year
          </Link>
        </div>
      </Container>

      <div className="border-y border-border bg-muted/30">
        <Container className="py-14">
          <div className="grid gap-10 sm:grid-cols-3">
            {howItWorks.map((s) => (
              <div key={s.step}>
                <p className="text-2xs font-medium tracking-[1px] text-primary uppercase">
                  {s.step}
                </p>
                <h2 className="mt-3 text-xl font-medium">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container id="studios" className="py-16 sm:py-20">
        <h2 className="text-3xl font-normal tracking-tight">Six studios</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Each one runs as its own team. Use one, or use all of them.
        </p>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {studios.map((studio) => {
            const from = studio.packages
              .map((p) => p.priceInr)
              .filter((p): p is number => p !== null)
              .sort((a, b) => a - b)[0];

            return (
              <li
                key={studio.slug}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <Link
                  href={`/studios/${studio.slug}`}
                  className="absolute inset-0 rounded-xl"
                  aria-label={`${studio.name} — ${studio.summary}`}
                />

                <h3 className="text-xl font-medium">{studio.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{studio.summary}</p>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {studio.pitch}
                </p>

                <ul className="mt-5 space-y-2">
                  {studio.deliverables.slice(0, 3).map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                  <p className="text-sm text-muted-foreground">
                    {from ? (
                      <>
                        From{" "}
                        <span className="font-medium text-foreground">{formatInr(from)}</span>
                      </>
                    ) : (
                      "Success fee"
                    )}
                  </p>
                  <span className="relative z-10 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View studio
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>

      <div className="border-t border-border">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="text-3xl font-normal tracking-tight text-balance">
            Members pay up to {memberDiscountPct}% less. Every studio, every package.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            One engagement usually covers the membership. Everything after that is
            saving.
          </p>
          <Link
            href="/membership"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8")}
          >
            See what membership includes
          </Link>
        </Container>
      </div>
    </>
  );
}
