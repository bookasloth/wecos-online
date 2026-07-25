import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Compact site-wide breadcrumb. One tight line, chevron separators, the last
 * crumb is the current page. Pass `href` on every crumb except the last.
 *
 *   <Breadcrumb items={[
 *     { label: "Studios", href: "/studios" },
 *     { label: "Marketing", href: "/studios/marketing" },
 *     { label: "BrightFunnel" },
 *   ]} />
 */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex min-w-0 items-center gap-1 text-sm text-muted-foreground", className)}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="truncate transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={cn("truncate", last && "font-medium text-foreground")}
              >
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />}
          </span>
        );
      })}
    </nav>
  );
}
