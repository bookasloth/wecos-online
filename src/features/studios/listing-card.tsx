"use client";

import Link from "next/link";
import { BadgeCheck, Crown, MapPin, Star } from "lucide-react";
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
    <li className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
      <Link
        href={`/startup/${listing.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Go to ${listing.name}`}
      />

      {/* Corner badge — Recommended (yellow) wins, else the WeCos label.
          Verified is conveyed by the tick next to the name, not here. */}
      <div className="relative z-10 mt-2 mb-4 flex min-h-6 justify-end">
        {listing.recommended ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1 text-2xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="size-3.5" />
            Recommended
          </span>
        ) : isWecos ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-2xs font-bold text-primary">
            <Crown className="size-3.5" />
            WeCos Studio
          </span>
        ) : null}
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
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-3xs font-medium text-primary">
          {isWecos ? <Crown className="size-3" /> : <BadgeCheck className="size-3" />}
          {isWecos ? "WeCos Team" : "Verified Provider"}
        </span>
      </div>

      {/* Price + Enquire — hidden until hover, then revealed from the bottom,
          growing the card. On touch devices (no hover) it's always shown. */}
      <div className="relative z-10 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:mt-4 group-hover:max-h-28 group-hover:opacity-100 [@media(hover:none)]:mt-4 [@media(hover:none)]:max-h-28 [@media(hover:none)]:opacity-100">
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {from ? (
              <>
                From <span className="font-semibold text-foreground">{formatInr(from)}</span>
              </>
            ) : (
              "On request"
            )}
          </p>
          <StudioEnquiry
            studioName={listing.name}
            label="Enquire now"
            className="h-9 px-5 text-sm font-bold"
          />
        </div>
      </div>
    </li>
  );
}
