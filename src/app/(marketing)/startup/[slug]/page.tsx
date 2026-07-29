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

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/patterns/breadcrumb";
import { CompanyPage, type CompanyPageData } from "@/features/startups/company-page";
import { createClient } from "@/lib/supabase/client";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import { sampleStartups, startupToCompanyData } from "@/lib/sample/sample-data";
import {
  categoryBySlug,
  listingBySlug,
  listingToCompanyData,
} from "@/features/studios/catalog";

/** Map a Supabase `startups` row into the shared company-page shape. */
function rowToCompanyData(s: {
  slug: string;
  name: string;
  tagline: string | null;
  about: string | null;
  logo_url: string | null;
  topics: string[] | null;
  founded_year: number | null;
  city: string | null;
  website: string | null;
  verified: boolean | null;
}): CompanyPageData {
  const industry = s.topics?.[0];
  return {
    slug: s.slug,
    name: s.name,
    tagline: s.tagline || "A startup on WeCos",
    industry,
    location: s.city || undefined,
    about: s.about || undefined,
    logoText: s.name.charAt(0).toUpperCase(),
    logoUrl: s.logo_url || undefined,
    website: s.website || undefined,
    verified: !!s.verified,
    topics: s.topics ?? undefined,
    overview: {
      website: s.website || undefined,
      industry,
      headquarters: s.city || undefined,
      founded: s.founded_year ? String(s.founded_year) : undefined,
      specialties: s.topics ?? undefined,
    },
  };
}

export default function StartupPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const hydrated = useAppHydrated();
  const storeStartup = useAppStore((s) => s.startup);
  const storeProfile = useAppStore((s) => s.profile);

  const listing = listingBySlug(slug);
  const sample = sampleStartups[slug];
  const isOwn = storeStartup?.slug === slug;

  // undefined = still fetching, null = no listed startup at this slug.
  const [remote, setRemote] = useState<CompanyPageData | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    (async () => {
      // Local sources win; only hit Supabase when the slug isn't a listing/sample.
      if (listing || sample || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (active) setRemote(null);
        return;
      }
      const { data, error } = await createClient()
        .from("startups")
        .select(
          "slug,name,tagline,about,logo_url,topics,founded_year,city,website,verified",
        )
        .eq("slug", slug)
        .eq("listed", true)
        .maybeSingle();
      if (active) setRemote(error || !data ? null : rowToCompanyData(data));
    })();
    return () => {
      active = false;
    };
  }, [slug, listing, sample]);

  const localData =
    sample ??
    (listing && listingToCompanyData(listing)) ??
    (isOwn && storeStartup ? startupToCompanyData(storeStartup, storeProfile) : null);

  // Still resolving: waiting on hydration (for own) or the Supabase lookup.
  if (!localData && (!hydrated || remote === undefined)) {
    return (
      <Container className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  const data = localData ?? remote;

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
