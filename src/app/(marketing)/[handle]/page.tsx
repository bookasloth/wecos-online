"use client";

/**
 * Public founder page at `/username`.
 *
 * Resolves from sample showcase data OR the local mock store (your own handle,
 * mapped into the rich shape). With the backend this becomes a server component
 * fetched by handle (SEO). Email is never shown publicly.
 *
 * Handle format and reserved words are validated in layout.tsx.
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { FounderProfile } from "@/features/profiles/founder-profile";
import { CopyLinkButton } from "@/components/share/copy-link-button";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import {
  sampleFounders,
  profileToFounderData,
} from "@/lib/sample/sample-data";

export default function PublicFounderPage() {
  const params = useParams<{ handle: string }>();
  const handle = decodeURIComponent(params.handle).toLowerCase();
  const hydrated = useAppHydrated();
  const storeProfile = useAppStore((s) => s.profile);
  const storeStartup = useAppStore((s) => s.startup);

  const sample = sampleFounders[handle];
  const isOwn = storeProfile?.handle === handle;

  if (!hydrated && !sample) {
    return (
      <Container className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </Container>
    );
  }

  const data =
    sample ??
    (isOwn && storeProfile ? profileToFounderData(storeProfile, storeStartup) : null);

  if (!data) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Founder not found</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          No founder is using <span className="font-medium">/{handle}</span> yet.
        </p>
        <Link href="/founders" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Browse founders
        </Link>
      </Container>
    );
  }

  return (
    <section className="bg-muted/30">
      <Container className="max-w-5xl py-6 sm:py-8">
        <div className="mb-3 flex justify-end">
          <CopyLinkButton path={`/${handle}`} />
        </div>
        <FounderProfile data={data} />
      </Container>
    </section>
  );
}
