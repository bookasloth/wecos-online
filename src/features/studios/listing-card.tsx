"use client";

import Link from "next/link";
import { BadgeCheck, Crown, MapPin } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { accent, categoryBySlug, fromPrice, type Listing } from "./catalog";
import { StudioEnquiry } from "./studio-enquiry";

/**
 * Directory listing card. Mirrors the /startups card design — round avatar,
 * name + verified tick, tag pills, stats row, centred Enquire button, whole-card
 * link. Listings have no logo image, so the category icon fills the avatar.
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const cat = categoryBySlug(listing.category);
  const a = cat ? accent[cat.accent] : accent.violet;
  const Icon = cat?.icon;
  const from = fromPrice(listing);
  const isWecos = listing.kind === "wecos";

  return (
    <li className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
      <Link
        href={`/startup/${listing.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Go to ${listing.name}`}
      />

      {/* Badge */}
      <div className="relative z-10 mt-2 mb-4 flex justify-end">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-2xs font-bold",
            isWecos ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {isWecos ? <Crown className="size-3.5" /> : <BadgeCheck className="size-3.5" />}
          {isWecos ? "WeCos Studio" : "Verified"}
        </span>
      </div>

      {/* Top row */}
      <div className="relative z-10 flex min-w-0 items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "-mt-4 grid size-20 shrink-0 place-items-center rounded-full border border-border shadow-sm",
            a.bg,
            a.text,
          )}
        >
          {Icon ? <Icon className="size-8" /> : null}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xl font-bold leading-tight">{listing.name}</span>
            {listing.verified && <BadgeCheck className="size-5 shrink-0 text-primary" />}
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
            {listing.tagline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {listing.pitch}
      </p>

      {/* Tags */}
      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-3xs font-medium text-muted-foreground">
          <span className={cn("size-1.5 rounded-full", a.dot)} />
          {cat?.label}
        </span>
        {listing.city ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-3xs font-medium text-muted-foreground">
            <MapPin className="size-3" />
            {listing.city}
          </span>
        ) : null}
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          {from ? (
            <>
              From <span className="font-medium text-foreground">{formatInr(from)}</span>
            </>
          ) : (
            "On request"
          )}
        </span>
        <span>•</span>
        <span>{isWecos ? "WeCos team" : "Verified provider"}</span>
      </div>

      {/* Bottom */}
      <div className="relative z-10 mt-5 flex items-center justify-center border-t border-border pt-4">
        <StudioEnquiry
          studioName={listing.name}
          label="Enquire"
          className="h-10 px-6 text-sm font-bold"
        />
      </div>
    </li>
  );
}
