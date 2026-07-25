import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { entryTier } from "@/config/site";

export const metadata: Metadata = { title: "Membership" };

export default function MembershipPage() {
  return (
    <PagePlaceholder
      eyebrow="Membership"
      title="One year of clarity, structure and belonging."
      description={`Join the WeCos Startup Engine from ₹${entryTier.priceInr.toLocaleString(
        "en-IN",
      )}/year. Full checkout and member benefits are coming soon.`}
    />
  );
}
