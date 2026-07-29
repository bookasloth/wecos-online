"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import { useCan } from "@/lib/authz/use-can";

/**
 * "Message" action on a founder profile. Enforces the messaging gate:
 * free members cannot DM a paid member — they must upgrade first
 * (capability `message.send`, Network+). See docs/FEATURES.md.
 *
 * `targetPaid` defaults to true: everyone shown in the founder directory is a
 * paid member. Pass false for a free member so free↔free messaging stays open.
 *
 * ⚠️ MOCK: sending is a toast placeholder — there is no message backend yet.
 * The gate is UI-only; the real check moves server-side with the messages table.
 */
export function MessageButton({
  targetName,
  targetPaid = true,
  isOwn = false,
}: {
  targetName: string;
  targetPaid?: boolean;
  isOwn?: boolean;
}) {
  const hydrated = useAppHydrated();
  const session = useAppStore((s) => s.session);
  const canMessage = useCan("message.send");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const className = cn(buttonVariants({ variant: "outline" }), "h-8 px-3 text-xs");

  // Can't message yourself.
  if (isOwn) return null;

  // Not signed in (or store not hydrated) → route to sign-up, unchanged.
  if (!hydrated || !session) {
    return (
      <Link href="/sign-up" className={className}>
        <MessageSquare className="size-3.5" />
        Message
      </Link>
    );
  }

  const mustUpgrade = targetPaid && !canMessage;

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() =>
          mustUpgrade
            ? setShowUpgrade(true)
            : toast.success(`Message sent to ${targetName}. (demo)`)
        }
      >
        {mustUpgrade ? <Lock className="size-3.5" /> : <MessageSquare className="size-3.5" />}
        Message
      </button>

      {showUpgrade && (
        <Modal
          title="Messaging is a member feature"
          onClose={() => setShowUpgrade(false)}
          titleAction={
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowUpgrade(false)}
              className="text-2xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          }
        >
          <p className="mt-2 text-sm text-muted-foreground">
            Free members can&apos;t message paid members. Upgrade to Solo or above
            to reach {targetName} and every other founder on WeCos.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => setShowUpgrade(false)}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              Not now
            </button>
            <Link
              href="/dashboard/membership"
              className={cn(buttonVariants(), "flex-1")}
            >
              See plans
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
