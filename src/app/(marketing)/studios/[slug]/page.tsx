import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import {
  studios,
  studioBySlug,
  memberDiscountPct,
  entryTier,
} from "@/config/site";
import { PackageCard } from "@/features/studios/package-card";
import { StudioEnquiry } from "@/features/studios/studio-enquiry";

export function generateStaticParams() {
  return studios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const studio = studioBySlug(slug);

  if (!studio) return { title: "Studio" };

  return {
    title: studio.name,
    description: studio.pitch,
    alternates: { canonical: `/studios/${studio.slug}` },
  };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const studio = studioBySlug(slug);

  if (!studio) notFound();
  // Studios were renamed in WeCos 2.0 (accounting → finance, human-resource → hr).
  // Old URLs still resolve, then redirect to the canonical one.
  if (studio.slug !== slug) redirect(`/studios/${studio.slug}`);

  const others = studios.filter((s) => s.slug !== studio.slug);

  return (
    <>
      <Container className="py-12 sm:py-16">
        <Link
          href="/studios"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All studios
        </Link>

        <p className="mt-8 text-2xs font-medium tracking-[1px] text-primary uppercase">
          WeCos Studios
        </p>
        <h1 className="mt-3 text-4xl font-normal tracking-tight sm:text-5xl">
          {studio.name}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {studio.pitch}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <StudioEnquiry studioName={studio.name} />
          <Link
            href="/membership"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Get up to {memberDiscountPct}% off as a member
          </Link>
        </div>
      </Container>

      <div className="border-y border-border bg-muted/30">
        <Container className="py-14">
          <h2 className="text-2xs font-medium tracking-[1px] text-muted-foreground uppercase">
            What the studio does
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studio.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-base leading-relaxed">
                <Check className="mt-1 size-4 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-normal tracking-tight">Packages</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Fixed scope and fixed price. Members pay up to {memberDiscountPct}% less —{" "}
          <Link href="/membership" className="font-medium text-primary hover:underline">
            membership starts at {formatInr(entryTier.priceInr)}/year
          </Link>
          .
        </p>

        <div
          className={cn(
            "mt-10 grid gap-6",
            studio.packages.length === 2 ? "sm:grid-cols-2" : "lg:grid-cols-3",
          )}
        >
          {studio.packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} studioName={studio.name} />
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Need something that isn&apos;t listed?{" "}
          <span className="text-foreground">Ask — most engagements get scoped custom.</span>
        </p>
      </Container>

      <div className="border-t border-border">
        <Container className="py-14">
          <h2 className="text-2xs font-medium tracking-[1px] text-muted-foreground uppercase">
            Other studios
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/studios/${s.slug}`}
                  className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  );
}
