"use client";

/**
 * Public startup page (LinkedIn company-page style). Resolves from sample
 * showcase data OR the local mock store (your own slug, mapped into the rich
 * shape). With the backend this becomes a server component fetched by slug (SEO).
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { CompanyPage } from "@/features/startups/company-page";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import {
  sampleStartups,
  startupToCompanyData,
} from "@/lib/sample/sample-data";

export default function PublicStartupPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const hydrated = useAppHydrated();
  const storeStartup = useAppStore((s) => s.startup);
  const storeProfile = useAppStore((s) => s.profile);

  const sample = sampleStartups[slug];
  const isOwn = storeStartup?.slug === slug;

  if (!hydrated && !sample) {
    return (
      <Container className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  const data =
    sample ??
    (isOwn && storeStartup ? startupToCompanyData(storeStartup, storeProfile) : null);

  if (!data) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Startup not found</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          This startup page isn&apos;t available. The public startup directory
          arrives with the backend phase.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Back home
        </Link>
      </Container>
    );
  }

  return (
    <section className="bg-muted/30">
      <Container className="max-w-7xl py-0 sm:py-0">
        <CompanyPage data={data} />
      </Container>
    </section>
  );
}
