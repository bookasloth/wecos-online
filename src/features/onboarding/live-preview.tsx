"use client";

import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { studios, siteConfig } from "@/config/site";

const host = siteConfig.url.replace(/^https?:\/\//, "");

/** Two initials from a name, for the avatar placeholder. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/**
 * The right half of onboarding: a live preview of the founder's public profile
 * as they fill the form. Pure presentational — every value is a prop lifted
 * from the flow's state, so it re-renders on each keystroke for free.
 */
export function LivePreview({
  fullName,
  headline,
  handle,
  cityName,
  needs,
  companyName,
  industry,
  className,
}: {
  fullName: string;
  headline: string;
  handle: string;
  cityName: string;
  needs: string[];
  companyName: string;
  industry: string;
  className?: string;
}) {
  const needLabels = needs
    .map((slug) => studios.find((s) => s.slug === slug)?.name)
    .filter(Boolean) as string[];

  return (
    <aside
      className={cn(
        "flex flex-col justify-center bg-muted/40 p-8 lg:p-12",
        className,
      )}
    >
      <p className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Live preview
      </p>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
            {initials(fullName) || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-foreground">
              {fullName.trim() || "Your name"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {headline.trim() || "Your headline"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm">
          <span className="text-muted-foreground">{host}/</span>
          <span className="font-medium text-foreground">
            {handle.trim() || "yourname"}
          </span>
        </div>

        {cityName ? (
          <p className="mt-3 text-sm text-muted-foreground">📍 {cityName}</p>
        ) : null}

        {needLabels.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {needLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-accent/60 px-2.5 py-1 text-xs font-medium text-accent-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}

        {companyName.trim() ? (
          <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Building2 className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {companyName.trim()}
              </p>
              {industry.trim() ? (
                <p className="truncate text-xs text-muted-foreground">{industry.trim()}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
        This is what other founders see. Everything here is editable later —
        except your link.
      </p>
    </aside>
  );
}
