"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { founders } from "@/lib/sample/sample-data";

const FILTERS = ["All", "Hiring", "Raising", "Investing", "Partnerships"];

export default function FoundersDirectoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();

    return founders
      .filter((f) => {
        const inQ =
          !q ||
          f.name.toLowerCase().includes(q) ||
          f.headline.toLowerCase().includes(q) ||
          (f.location ?? "").toLowerCase().includes(q);

        const inF =
          filter === "All" ||
          (f.openTo ?? []).some((o) =>
            o.toLowerCase().includes(filter.toLowerCase())
          );

        return inQ && inF;
      })
      .sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
  }, [query, filter]);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Founders on WeCos
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Meet the founders building calmly. Connect, follow and grow your network.
          </p>
        </div>

        <Link
          href="/sign-up"
          className={cn(buttonVariants({ variant: "default" }), "h-10")}
        >
          Create your profile
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search founders, roles, cities…"
            className="h-10 pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filter === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {list.length} founder{list.length === 1 ? "" : "s"}
      </p>

      {list.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No founders match your search.
        </div>
      ) : (
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((f) => (
            <div
              key={f.handle}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:shadow-[0_2px_10px_rgba(255,255,255,0.05)]"
            >
              {/* Top bar */}
              <div className="flex h-[36px] items-center justify-between px-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-3xs font-semibold text-primary">
                  <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                    <path d="M5 21h14" />
                  </svg>
                  Recommended
                </span>
                {f.currentCompany?.name && (
                  <span className="truncate text-2xs font-medium text-muted-foreground">
                    {f.currentCompany.name}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex h-[100px] items-center justify-center">
                {f.avatarUrl ? (
                  <img
                    src={f.avatarUrl}
                    alt={f.name}
                    className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-lg"
                  />
                ) : (
                  <span className="grid h-24 w-24 place-items-center rounded-full border-4 border-card bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl font-bold text-white shadow-lg">
                    {f.avatarText}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                {/* Name + Badge */}
                <div className="flex h-[36px] items-center justify-center gap-1.5 px-5">
                  <h3 className="truncate text-base font-bold text-foreground">{f.name}</h3>
                  {f.verified && (
                    <svg className="size-4 shrink-0 text-success" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Bio */}
                <div className="h-[48px] px-5 text-center">
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {f.headline}
                  </p>
                </div>

                {/* Location */}
                <div className="flex h-[24px] items-center justify-center gap-1 text-2xs text-muted-foreground">
                  <svg className="size-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="truncate">{f.location ?? "Earth"}</span>
                </div>

                {/* Buttons */}
                <div className="mt-auto flex gap-2 border-t border-border px-4 py-3">
                  <Link
                    href="/sign-up"
                    className="flex-1 rounded-xl bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Connect
                  </Link>
                  <Link
                    href={`/${f.handle}`}
                    className="flex-1 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-center text-xs font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-primary/10"
                  >
                    Visit Page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}