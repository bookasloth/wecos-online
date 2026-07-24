"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { ProfileView } from "@/features/profiles/profile-view";
import { useAppStore } from "@/lib/store/app-store";

export default function ProfileViewPage() {
  const profile = useAppStore((s) => s.profile);
  const session = useAppStore((s) => s.session);

  if (!profile) {
    return (
      <div>
        <DashboardHeader title="Profile" />
        <p className="text-sm text-muted-foreground">No profile yet.</p>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Profile"
        description="How you appear to other founders."
        action={
          <div className="flex gap-2">
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ExternalLink className="size-4" />
              View public page
            </Link>
            <Link
              href="/dashboard/profile/edit"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        }
      />
      <ProfileView profile={profile} email={session?.email} />
    </div>
  );
}
