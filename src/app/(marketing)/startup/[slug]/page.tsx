"use client";

/**
 * The one canonical startup page. Every member has exactly one startup, and
 * this is its page — reached from the /startups community directory, the
 * /studios services directory, or a founder profile. It resolves from (in
 * order): a studio listing, the sample showcase, or the user's own mock store.
 *
 * A startup that offers services (a studio listing, with packages) renders the
 * Services section; a community-only startup just shows its company info.
 * With the backend this becomes one server component fetched by slug.
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/patterns/breadcrumb";
import { CompanyPage } from "@/features/startups/company-page";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import { sampleStartups, startupToCompanyData } from "@/lib/sample/sample-data";
import {
  categoryBySlug,
  listingBySlug,
  listingToCompanyData,
} from "@/features/studios/catalog";

export default function StartupPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const hydrated = useAppHydrated();
  const storeStartup = useAppStore((s) => s.startup);
  const storeProfile = useAppStore((s) => s.profile);

  const listing = listingBySlug(slug);
  const sample = sampleStartups[slug];
  const isOwn = storeStartup?.slug === slug;

  if (!listing && !sample && !hydrated) {
    return (
      <Container className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  // Prefer the rich sample when one exists; otherwise map the studio listing.
  const data =
    sample ??
    (listing && listingToCompanyData(listing)) ??
    (isOwn && storeStartup ? startupToCompanyData(storeStartup, storeProfile) : null);

  if (!data) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Startup not found</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          This startup page isn&apos;t available. The public directory arrives
          with the backend phase.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Back home
        </Link>
      </Container>
    );
  }

  // Breadcrumb reflects where the startup lives: a service provider sits under
  // its studio category; a community-only startup under Startups.
  const cat = listing ? categoryBySlug(listing.category) : null;
  const crumbs = cat
    ? [
        { label: "Studios", href: "/studios" },
        { label: cat.label, href: `/studios/${listing!.category}` },
        { label: data.name },
      ]
    : [{ label: "Startups", href: "/startups" }, { label: data.name }];

  return (
    <section className="bg-muted/30">
      <Container className="max-w-7xl py-0 sm:py-0">
        <div className="pt-6">
          <Breadcrumb items={crumbs} />
        </div>
        <CompanyPage data={data} />
      </Container>
    </section>
  );
}
