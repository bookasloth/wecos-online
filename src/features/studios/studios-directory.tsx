"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { accent, categories, listings, type Listing } from "./catalog";
import { fetchProviderListings } from "./providers";
import { ListingCard } from "./listing-card";

/**
 * The /studios directory: search + category chips over WeCos's first-party
 * studios plus real opted-in provider startups from Supabase.
 */
export function StudiosDirectory() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [providers, setProviders] = useState<Listing[]>([]);

  useEffect(() => {
    let active = true;
    fetchProviderListings()
      .then((p) => active && setProviders(p))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Real providers first, then the static WeCos studios / catalog.
  const all = useMemo(() => [...providers, ...listings], [providers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((l) => {
      if (active !== "all" && l.category !== active) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q) ||
        (l.city?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, active, all]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search studios, services or cities"
            className="pl-9"
            aria-label="Search studios"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip active={active === "all"} onClick={() => setActive("all")}>
            All
          </Chip>
          {categories.map((c) => {
            const Icon = c.icon;
            const on = active === c.slug;
            return (
              <Chip key={c.slug} active={on} onClick={() => setActive(c.slug)}>
                <Icon className={cn("size-3.5", on ? accent[c.accent].text : "")} />
                {c.label}
              </Chip>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "listing" : "listings"}
      </p>

      {filtered.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-muted-foreground">
          No studios match that. Try a different search or category.
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-accent/60 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
