import type { Metadata } from "next";
import { startups } from "@/lib/sample/sample-data";

/** The page is a client component, so per-venture metadata is generated here. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const startup = startups.find((s) => s.slug === slug);

  if (!startup) return { title: "Venture" };

  return {
    title: startup.name,
    description: startup.tagline ?? `${startup.name} on WeCos.`,
    alternates: { canonical: `/venture/${startup.slug}` },
  };
}

export default function VentureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
