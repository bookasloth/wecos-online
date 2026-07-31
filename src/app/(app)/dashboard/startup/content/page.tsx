"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { StartupContentForm } from "@/features/startups/startup-content-form";
import { useAppStore } from "@/lib/store/app-store";

export default function StartupContentPage() {
  const router = useRouter();
  const startup = useAppStore((s) => s.startup);

  if (!startup) {
    return (
      <div>
        <DashboardHeader
          title="Page content"
          description="Add your team, services and funding."
        />
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
          Create your startup page first.
          <div className="mt-4">
            <Link href="/dashboard/startup/edit" className={cn(buttonVariants({ variant: "default" }), "h-9")}>
              Create startup page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Page content"
        description="Team, services and funding shown on your public page."
      />
      <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
        <StartupContentForm onSaved={() => router.push("/dashboard/startup")} />
      </div>
    </div>
  );
}
