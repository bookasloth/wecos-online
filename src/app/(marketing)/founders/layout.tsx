import type { Metadata } from "next";

/** Metadata lives here because the page is a client component. */
export const metadata: Metadata = {
  title: "Founders",
  description:
    "Meet the founders building on WeCos — profiles, startups and what they're working on.",
  alternates: { canonical: "/founders" },
};

export default function FoundersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
