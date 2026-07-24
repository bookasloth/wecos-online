"use client";

import Link from "next/link";
import { ArrowRight, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { studios, memberDiscountPct } from "@/config/site";
import { MembershipCard } from "@/features/account/membership-card";
import { useAppStore } from "@/lib/store/app-store";

export default function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  const startup = useAppStore((s) => s.startup);
  const membership = useAppStore((s) => s.membership);
  const firstName = (profile?.fullName ?? "Founder").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-normal tracking-tight">Welcome, {firstName}.</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s your founder workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MembershipCard />

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="size-4" />
            Your profile
          </div>
          <p className="mt-3 text-lg font-medium">{profile?.fullName ?? "—"}</p>
          {profile?.headline ? (
            <p className="text-sm text-muted-foreground">{profile.headline}</p>
          ) : null}
          <Link
            href="/dashboard/profile"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
          >
            View profile
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="size-4" />
            Your startup
          </div>
          {startup ? (
            <>
              <p className="mt-3 text-lg font-medium">{startup.name}</p>
              {startup.tagline ? (
                <p className="text-sm text-muted-foreground">{startup.tagline}</p>
              ) : null}
              <Link
                href="/dashboard/startup"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
              >
                View startup
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                You haven&apos;t created your startup page yet.
              </p>
              <Link
                href="/dashboard/startup/edit"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "mt-5")}
              >
                Create startup page
              </Link>
            </>
          )}
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-6">
          <div>
            <p className="text-2xs font-medium tracking-[1px] text-primary uppercase">
              WeCos Studios
            </p>
            <h2 className="mt-2 text-xl font-medium">Get the work done for you</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {membership
                ? `Your membership takes ${memberDiscountPct}% off every package.`
                : `Members pay ${memberDiscountPct}% less on every package.`}
            </p>
          </div>
          <Link
            href="/studios"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            All studios
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((s) => (
            <li key={s.slug} className="bg-card">
              <Link
                href={`/studios/${s.slug}`}
                className="block h-full p-5 transition-colors hover:bg-muted/50"
              >
                <p className="font-medium">{s.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
