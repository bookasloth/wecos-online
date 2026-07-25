"use client";

import Link from "next/link";
import { Building2, ExternalLink, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { StartupDisplay } from "@/features/startups/startup-display";
import { useAppStore } from "@/lib/store/app-store";

export default function StartupViewPage() {
  const startup = useAppStore((s) => s.startup);

  if (!startup) {
    return (
      <div>
        <DashboardHeader title="Startup" description="Your public startup page." />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Building2 className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">No startup page yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create your startup page so investors, partners and talent can find you.
          </p>
          <Link
            href="/dashboard/startup/edit"
            className={cn(buttonVariants({ variant: "default" }), "mt-6 h-10")}
          >
            Create startup page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Startup"
        description="Your public startup page."
        action={
          <div className="flex gap-2">
            <Link
              href={`/startup/${startup.slug}`}
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ExternalLink className="size-4" />
              View public page
            </Link>
            <Link
              href="/dashboard/startup/edit"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        }
      />
      <StartupDisplay startup={startup} />
    </div>
  );
}
