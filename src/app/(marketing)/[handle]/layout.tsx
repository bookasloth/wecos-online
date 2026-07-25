import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isValidHandle } from "@/config/site";
import { sampleFounders } from "@/lib/sample/sample-data";

/**
 * Founder vanity URLs — `/username`, Medium/YouTube style.
 *
 * This sits at the ROOT of the marketing group, so it shares a namespace with
 * every top-level route. Two things keep that safe:
 *
 * 1. Next.js resolves static segments before dynamic ones, so `/about` and
 *    `/studios` always win over `[handle]` — the profile route never sees them.
 * 2. `reservedHandles` in config/site.ts stops anyone claiming those words as a
 *    username in the first place. Keep the two in sync: adding a top-level route
 *    without reserving the word breaks whoever already owns that handle.
 *
 * NOTE: the folder is `[handle]`, not `@[handle]` — a folder name starting with
 * `@` is Next.js parallel-route syntax and would not produce a URL segment.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle: raw } = await params;
  const handle = decodeURIComponent(raw).toLowerCase();
  if (!isValidHandle(handle)) return { title: "Not found" };

  const founder = sampleFounders[handle];
  if (!founder) return { title: `/${handle}` };

  return {
    title: founder.name,
    description: founder.headline,
    alternates: { canonical: `/${handle}` },
  };
}

export default async function FounderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ handle: string }>;
}) {
  const { handle: raw } = await params;
  const decoded = decodeURIComponent(raw);
  const handle = decoded.toLowerCase();

  if (!isValidHandle(handle)) notFound();

  // Handles are case-insensitive, so /ElonMusk and /elonmusk would otherwise be
  // two URLs for one profile. Canonicalize to lowercase.
  if (decoded !== handle) redirect(`/${handle}`);

  // ⚠️ SOFT 404: a handle that doesn't belong to anyone still returns HTTP 200
  // with a "not found" body, because profiles currently resolve client-side from
  // the mock store — the server can't know whether the visitor's own local
  // profile uses this handle. Once profiles come from the database, look the
  // handle up here and call notFound() so typo'd URLs return a real 404. With
  // handles at the URL root, search engines will hit a lot of these.
  return children;
}
