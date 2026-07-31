"use client";

import { useEffect, useState } from "react";
import type { Listing } from "./catalog";
import { fetchProviderListings } from "./providers";
import { ListingCard } from "./listing-card";

/**
 * Category listing grid: real opted-in providers (from Supabase, this category)
 * first, then the static WeCos/catalog entries passed from the server page.
 */
export function CategoryListings({
  category,
  staticItems,
}: {
  category: string;
  staticItems: Listing[];
}) {
  const [providers, setProviders] = useState<Listing[]>([]);

  useEffect(() => {
    let on = true;
    fetchProviderListings(category)
      .then((p) => on && setProviders(p))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, [category]);

  // Real providers first; drop any static entry with the same slug (DB wins).
  const provSlugs = new Set(providers.map((p) => p.slug));
  const all = [...providers, ...staticItems.filter((l) => !provSlugs.has(l.slug))];

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {all.map((l) => (
        <ListingCard key={l.slug} listing={l} />
      ))}
    </ul>
  );
}
