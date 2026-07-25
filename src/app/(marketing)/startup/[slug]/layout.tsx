import type { Metadata } from "next";
import { startups } from "@/lib/sample/sample-data";
import { listingBySlug } from "@/features/studios/catalog";

/** The page is a client component, so per-startup metadata is generated here. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = listingBySlug(slug);
  const startup = startups.find((s) => s.slug === slug);
  const name = listing?.name ?? startup?.name;

  if (!name) return { title: "Startup" };

  return {
    title: name,
    description: listing?.pitch ?? startup?.tagline ?? `${name} on WeCos.`,
    alternates: { canonical: `/startup/${slug}` },
  };
}

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
