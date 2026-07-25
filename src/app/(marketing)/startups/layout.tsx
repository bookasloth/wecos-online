import type { Metadata } from "next";

/**
 * The page itself is a client component (it owns the filter/sort state), and
 * client components cannot export `metadata` — so it lives in this layout.
 */
export const metadata: Metadata = {
  title: "Startups",
  description:
    "Browse the WeCos startup directory — discover Indian startups by industry, stage and traction.",
  alternates: { canonical: "/startups" },
};

export default function StartupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
