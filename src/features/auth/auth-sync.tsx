"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Bridges the real Supabase auth session into the local store so the existing
 * store-driven UI (navbar, guards, dashboard) keeps working while data is
 * migrated off localStorage. Supabase owns the session/passwords; this just
 * mirrors "who is signed in" into the store.
 *
 * No-ops until the Supabase env vars are set.
 */
export function AuthSync() {
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    ) {
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email;
      if (email) signIn({ email });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") signOut();
      else if (session?.user?.email) signIn({ email: session.user.email });
    });

    return () => sub.subscription.unsubscribe();
  }, [signIn, signOut]);

  return null;
}
