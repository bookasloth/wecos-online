"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, ProfileValues } from "@/features/profiles/schema";
import type { Startup, StartupValues, StartupDetails } from "@/features/startups/schema";
import type { FeedPost, PostContent, Vote } from "@/features/feed/schema";
import { nid, authorFromProfile, applyVote } from "@/features/feed/feed-utils";
import { sampleFeed } from "@/lib/sample/sample-feed";
import { pricing, isValidHandle, tierById, type TierId } from "@/config/site";

/**
 * ⚠️ MOCK DATA LAYER — UI-first phase only. State persists to localStorage so the
 * register → onboard → profile → startup flow is fully interactive without a backend.
 *
 * This is NOT real auth and NOT secure (no password check, no server, no session token).
 * When wiring the backend: replace each action body with a Supabase call + TanStack
 * Query, and move gating to middleware + RLS. The component-facing API stays the same,
 * so screens won't change.
 */

export type Session = { email: string; fullName: string };

/**
 * Membership. Four annual tiers priced in `tiers` (config/site.ts) — the deck's
 * single ₹3,650/year plan is superseded; see docs/FEATURES.md.
 *
 * ⚠️ MOCK: `activateMembership` just flips local state. No payment, no seat
 * reservation, no server. When Razorpay is wired, replace the action body with a
 * checkout + webhook confirmation; the component-facing shape stays the same, so
 * no screen changes.
 */
export type Membership = {
  tier: TierId;
  status: "active";
  startedAt: string;
  renewsAt: string;
  pricePaidInr: number;
  /**
   * Founding seat, out of `pricing.foundingSeats`. Only granted at Venture and
   * above — otherwise all 500 burn on the cheapest tier and the badge means
   * "was early" rather than "backed us properly".
   *
   * ⚠️ MOCK: a plausible number, not an actual reservation. Real allocation
   * needs a unique index and a transaction.
   */
  foundingSeat?: number;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/**
 * Handles are root-level URLs (`/username`), so a generated one can collide with
 * a route word — `admin@…` would otherwise mint the unroutable handle `admin`.
 * Suffix anything reserved or malformed so every profile has a working URL.
 *
 * ⚠️ MOCK: no uniqueness check across users — there's no server to ask. The real
 * implementation needs a unique index on `profile.handle` and a claim flow.
 */
const toHandle = (source: string) => {
  const base = slugify(source) || "founder";
  return isValidHandle(base) ? base : `${base}-1`;
};

type AppState = {
  session: Session | null;
  onboarded: boolean;
  profile: Profile | null;
  startup: Startup | null;
  posts: FeedPost[];

  membership: Membership | null;

  activateMembership: (tier: TierId) => void;
  cancelMembership: () => void;

  addPost: (content: PostContent) => string;
  votePost: (id: string, dir: 1 | -1) => void;
  toggleBookmark: (id: string) => void;
  addComment: (postId: string, body: string) => void;
  voteComment: (postId: string, commentId: string, dir: 1 | -1) => void;
  votePoll: (postId: string, optionId: string) => void;
  answerQuiz: (postId: string, optionId: string) => void;

  signUp: (input: { fullName: string; email: string }) => void;
  signIn: (input: { email: string }) => void;
  /**
   * Rehydrate a returning user from their Supabase rows on sign-in. `onboarded`
   * lives only in local storage, so without this a returning user on a fresh
   * browser is wrongly sent back through onboarding. Marks them onboarded and
   * restores profile/startup from the server.
   */
  hydrateFromRemote: (input: {
    profile: Profile;
    startup: Startup | null;
    membership: Membership | null;
  }) => void;
  signOut: () => void;
  saveProfile: (values: ProfileValues) => void;
  /** Claim a vanity handle. Caller must validate with `isValidHandle` first. */
  setHandle: (handle: string) => void;
  saveStartup: (values: StartupValues) => void;
  /** Merge rich page content (products/people/funding) into the startup. */
  saveStartupDetails: (details: StartupDetails) => void;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: null,
      onboarded: false,
      profile: null,
      startup: null,
      posts: sampleFeed,

      membership: null,

      activateMembership: (tier) =>
        set(() => {
          const now = new Date();
          const renews = new Date(now);
          renews.setFullYear(renews.getFullYear() + 1);

          const paidTiers: TierId[] = ["venture", "circle"];
          const eligibleForSeat = paidTiers.includes(tier);

          return {
            membership: {
              tier,
              status: "active",
              startedAt: now.toISOString(),
              renewsAt: renews.toISOString(),
              pricePaidInr: tierById(tier).priceInr,
              foundingSeat: eligibleForSeat
                ? Math.floor(Math.random() * pricing.foundingSeats) + 1
                : undefined,
            },
          };
        }),

      cancelMembership: () => set({ membership: null }),

      addPost: (content) => {
        const id = nid();
        const author = authorFromProfile(get().profile);
        const post: FeedPost = {
          id,
          author,
          createdAt: new Date().toISOString(),
          content,
          score: 1,
          myVote: 1,
          commentCount: 0,
          comments: [],
          bookmarked: false,
        };
        set((s) => ({ posts: [post, ...s.posts] }));
        return id;
      },

      votePost: (id, dir) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, ...applyVote(p.score, p.myVote, dir) } : p,
          ),
        })),

      toggleBookmark: (id) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id ? { ...p, bookmarked: !p.bookmarked } : p,
          ),
        })),

      addComment: (postId, body) =>
        set((s) => {
          const author = authorFromProfile(get().profile);
          return {
            posts: s.posts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    commentCount: p.commentCount + 1,
                    comments: [
                      ...p.comments,
                      {
                        id: nid(),
                        author,
                        body,
                        createdAt: new Date().toISOString(),
                        score: 1,
                        myVote: 1 as Vote,
                      },
                    ],
                  }
                : p,
            ),
          };
        }),

      voteComment: (postId, commentId, dir) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.map((c) =>
                    c.id === commentId
                      ? { ...c, ...applyVote(c.score, c.myVote, dir) }
                      : c,
                  ),
                }
              : p,
          ),
        })),

      votePoll: (postId, optionId) =>
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId || p.content.kind !== "poll") return p;
            const prev = p.content.myChoice;
            if (prev === optionId) return p;
            const options = p.content.options.map((o) => {
              if (o.id === optionId) return { ...o, votes: o.votes + 1 };
              if (o.id === prev) return { ...o, votes: Math.max(0, o.votes - 1) };
              return o;
            });
            return { ...p, content: { ...p.content, options, myChoice: optionId } };
          }),
        })),

      answerQuiz: (postId, optionId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId && p.content.kind === "quiz"
              ? { ...p, content: { ...p.content, myAnswer: optionId } }
              : p,
          ),
        })),

      signUp: ({ fullName, email }) =>
        set({
          session: { fullName, email },
          onboarded: false,
          profile: {
            id: uid(),
            email,
            handle: toHandle(email.split("@")[0] || fullName),
            fullName,
            headline: "",
            location: "",
            bio: "",
            avatarUrl: "",
          },
        }),

      signIn: ({ email }) => {
        const existing = get().profile;
        if (existing && existing.email === email) {
          set({ session: { email, fullName: existing.fullName } });
        } else {
          // No local record (mock) — create a minimal session so the demo flows.
          set({
            session: { email, fullName: email.split("@")[0] || "Founder" },
          });
        }
      },

      hydrateFromRemote: ({ profile, startup, membership }) =>
        set((state) => ({
          profile,
          startup: startup ?? state.startup,
          // DB is authoritative for the tier: this overwrites any locally-forged
          // membership at sign-in. null = free.
          membership: membership ?? null,
          onboarded: true,
          session: state.session
            ? { ...state.session, fullName: profile.fullName }
            : { email: profile.email, fullName: profile.fullName },
        })),

      signOut: () => set({ session: null }),

      saveProfile: (values) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...values }
            : {
                id: uid(),
                email: state.session?.email ?? "",
                handle: toHandle(values.fullName),
                ...values,
              },
          session: state.session
            ? { ...state.session, fullName: values.fullName }
            : state.session,
        })),

      setHandle: (handle) =>
        set((state) =>
          state.profile
            ? { profile: { ...state.profile, handle: handle.toLowerCase() } }
            : state,
        ),

      saveStartup: (values) =>
        set((state) => ({
          startup: state.startup
            ? { ...state.startup, ...values }
            : { id: uid(), slug: slugify(values.name), ...values },
        })),

      saveStartupDetails: (details) =>
        set((state) =>
          state.startup
            ? {
                startup: {
                  ...state.startup,
                  details: { ...state.startup.details, ...details },
                },
              }
            : state,
        ),

      completeOnboarding: () => set({ onboarded: true }),
    }),
    { name: "wecos-app-v1", version: 1 },
  ),
);

/**
 * Guards against SSR/hydration mismatch: persisted store is empty on the server,
 * so client screens must wait for rehydration before reading auth state.
 */
export function useAppHydrated() {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
