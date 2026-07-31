"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check, Newspaper } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * The community feed isn't live yet. Instead of shipping the mock feed, show a
 * coming-soon with an email capture so early members can be notified. Emails go
 * to the `feed_waitlist` table (public insert, re-subscribe is a no-op).
 */
export function FeedComingSoon() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const subscribe = async () => {
    if (!emailOk(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    setSending(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { error } = await createClient()
          .from("feed_waitlist")
          .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
        if (error) throw error;
      }
      setDone(true);
      toast.success("You're on the list — we'll email you when the feed goes live.");
    } catch {
      toast.error("Couldn't subscribe. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Newspaper className="size-6" />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-wide text-primary uppercase">
        Community feed
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Coming soon</h1>
      <p className="mt-4 max-w-md text-balance text-muted-foreground">
        A place for founders to share updates, ask questions and back each other.
        Subscribe to be the first to know when it goes live.
      </p>

      {done ? (
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground">
          <Check className="size-4 text-primary" />
          You&apos;re on the list.
        </p>
      ) : (
        <div className="mt-8 flex w-full max-w-sm flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@startup.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && subscribe()}
            className="h-11"
          />
          <Button onClick={subscribe} disabled={sending} className="h-11 shrink-0">
            {sending ? <Loader2 className="size-4 animate-spin" /> : "Notify me"}
          </Button>
        </div>
      )}

      <span className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-warning" />
        In development
      </span>
    </Container>
  );
}
