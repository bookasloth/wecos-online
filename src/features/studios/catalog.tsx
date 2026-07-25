import {
  Megaphone,
  Users,
  Calculator,
  Scale,
  Coins,
  Code,
  type LucideIcon,
} from "lucide-react";
import { studios, type StudioPackage } from "@/config/site";
import { formatInr } from "@/lib/utils";
import type { CompanyPageData } from "@/features/startups/company-page";

/**
 * The Studios directory catalog.
 *
 * `/studios` is a marketplace of service businesses that founders can hire. Two
 * kinds of listing share one shape so cards and detail pages don't care who owns
 * them: WeCos's own six studios (`kind: "wecos"`, first-party, shown first) and
 * member businesses who took the Studios Plan (`kind: "provider"`).
 *
 * ⚠️ MOCK: the provider listings below are sample data. Real listings come from
 * the Studios Plan opt-in + a listings table in the backend phase. WeCos
 * listings are derived from `studios` in site.ts (still the single source).
 */

export type Category = {
  slug: string;
  label: string;
  icon: LucideIcon;
  /** Key into `accent` below. Kept as a name so data stays serialisable. */
  accent: AccentName;
  blurb: string;
};

type AccentName = "violet" | "sky" | "emerald" | "amber" | "rose" | "cyan";

/** Literal class strings so Tailwind's JIT keeps them. */
export const accent: Record<
  AccentName,
  { text: string; bg: string; ring: string; dot: string }
> = {
  violet: { text: "text-violet-500", bg: "bg-violet-500/10", ring: "ring-violet-500/30", dot: "bg-violet-500" },
  sky: { text: "text-sky-500", bg: "bg-sky-500/10", ring: "ring-sky-500/30", dot: "bg-sky-500" },
  emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", dot: "bg-emerald-500" },
  amber: { text: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/30", dot: "bg-amber-500" },
  rose: { text: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/30", dot: "bg-rose-500" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500/10", ring: "ring-cyan-500/30", dot: "bg-cyan-500" },
};

/** The six categories — WeCos's studios double as the directory's taxonomy. */
export const categories: Category[] = [
  { slug: "marketing", label: "Marketing", icon: Megaphone, accent: "violet", blurb: "Growth, brand, content and demand." },
  { slug: "hr", label: "HR & People", icon: Users, accent: "sky", blurb: "Hiring, payroll, policy and culture." },
  { slug: "finance", label: "Finance", icon: Calculator, accent: "emerald", blurb: "Books, tax, compliance and CFO help." },
  { slug: "legal", label: "Legal", icon: Scale, accent: "amber", blurb: "Incorporation, contracts and IP." },
  { slug: "capital-circle", label: "Capital", icon: Coins, accent: "rose", blurb: "Fundraising, decks and investor intros." },
  { slug: "technology", label: "Technology", icon: Code, accent: "cyan", blurb: "Product, engineering and data." },
];

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export type Listing = {
  slug: string;
  name: string;
  /** Category slug — one of `categories`. */
  category: string;
  tagline: string;
  pitch: string;
  deliverables: string[];
  packages: StudioPackage[];
  kind: "wecos" | "provider";
  verified?: boolean;
  city?: string;
  parentVenture?: string;
};

/** WeCos's own studios as first-party listings. Slug-prefixed to sit beside the
 *  same-named category segment in the URL (/studios/marketing/wecos-marketing). */
const wecosListings: Listing[] = studios.map((s) => ({
  slug: `wecos-${s.slug}`,
  name: s.name,
  category: s.slug,
  tagline: s.summary,
  pitch: s.pitch,
  deliverables: s.deliverables,
  packages: s.packages,
  kind: "wecos",
}));

/** ⚠️ MOCK member providers. */
const providerListings: Listing[] = [
  {
    slug: "rajmudra-media",
    name: "Rajmudra Media",
    category: "marketing",
    tagline: "Performance & brand marketing for startups",
    pitch:
      "A performance-and-brand marketing studio for early-stage Indian founders — paid, SEO, content and lifecycle run as one pod.",
    deliverables: ["Paid acquisition (Meta, Google, LinkedIn)", "SEO & content engine", "Lifecycle email & CRO"],
    packages: [
      { name: "Launch", priceInr: 15000, cadence: "per month", summary: "Get your first channel working.", includes: ["1 paid channel", "4 content pieces / month", "Landing page", "Monthly report"] },
      { name: "Growth", priceInr: 25000, cadence: "per month", summary: "The full growth stack, run for you.", includes: ["2 paid channels", "SEO", "Lifecycle email", "Bi-weekly review"], featured: true },
      { name: "Scale", priceInr: 50000, cadence: "per month", summary: "Dedicated pod post-PMF.", includes: ["All channels", "Strategist", "Creative production", "Weekly review"] },
    ],
    kind: "provider",
    verified: true,
    city: "Pune",
    parentVenture: "Rajmudra Media",
  },
  {
    slug: "brightfunnel",
    name: "BrightFunnel",
    category: "marketing",
    tagline: "Performance marketing for D2C",
    pitch: "A paid-and-lifecycle pod that has scaled a dozen Indian D2C brands past their first crore.",
    deliverables: ["Meta & Google performance ads", "Retention email & WhatsApp", "Landing-page CRO"],
    packages: [
      { name: "Starter", priceInr: 20000, cadence: "per month", summary: "One channel, run properly.", includes: ["1 paid channel", "Weekly reporting", "Creative testing"] },
      { name: "Full funnel", priceInr: 40000, cadence: "per month", summary: "Acquisition + retention.", includes: ["2 channels", "Lifecycle email", "CRO", "Bi-weekly calls"], featured: true },
    ],
    kind: "provider",
    verified: true,
    city: "Bangalore",
    parentVenture: "BrightFunnel Labs",
  },
  {
    slug: "storyleaf",
    name: "Storyleaf",
    category: "marketing",
    tagline: "Content & SEO studio",
    pitch: "Founder-led content and technical SEO that ranks — no keyword-stuffed fluff.",
    deliverables: ["Content strategy & calendar", "Technical SEO audits", "Long-form + repurposing"],
    packages: [
      { name: "Content", priceInr: 18000, cadence: "per month", summary: "Publish consistently.", includes: ["6 pieces / month", "SEO briefs", "Distribution"] },
    ],
    kind: "provider",
    verified: true,
    city: "Pune",
  },
  {
    slug: "hirekar",
    name: "Hirekar",
    category: "hr",
    tagline: "Startup recruitment on demand",
    pitch: "Embedded recruiters who fill engineering and GTM roles without a retainer you can't afford.",
    deliverables: ["Sourcing & screening", "Interview kits", "Offer negotiation"],
    packages: [
      { name: "Per hire", priceInr: 18000, cadence: "per hire", summary: "Pay when you hire.", includes: ["Role scoping", "Sourcing", "Screening", "Offer support"], featured: true },
    ],
    kind: "provider",
    verified: true,
    city: "Gurugram",
  },
  {
    slug: "ledgerly",
    name: "Ledgerly",
    category: "finance",
    tagline: "Bookkeeping & compliance",
    pitch: "Clean books, on-time GST and TDS, and numbers a founder can actually read.",
    deliverables: ["Monthly bookkeeping", "GST & TDS filing", "MIS dashboards"],
    packages: [
      { name: "Monthly", priceInr: 9000, cadence: "per month", summary: "Books + filings handled.", includes: ["Bookkeeping", "GST/TDS", "Monthly MIS"] },
      { name: "CFO lite", priceInr: 30000, cadence: "per month", summary: "Add planning & runway.", includes: ["Everything in Monthly", "Runway model", "Board pack"], featured: true },
    ],
    kind: "provider",
    verified: true,
    city: "Mumbai",
  },
  {
    slug: "clausewise",
    name: "Clausewise",
    category: "legal",
    tagline: "Startup legal, fixed fee",
    pitch: "Incorporation, contracts and cap-table hygiene from lawyers who work with founders daily.",
    deliverables: ["Incorporation & ROC", "Contracts & policies", "Cap table & ESOP"],
    packages: [
      { name: "Incorporate", priceInr: 12000, cadence: "one-time", summary: "Company, done right.", includes: ["Pvt Ltd registration", "Founder agreement", "Starter contracts"] },
    ],
    kind: "provider",
    verified: true,
    city: "Bangalore",
  },
  {
    slug: "runway-partners",
    name: "Runway Partners",
    category: "capital-circle",
    tagline: "Fundraising advisory",
    pitch: "Deck, model and warm investor intros — a boutique that has closed early rounds across fintech and SaaS.",
    deliverables: ["Pitch deck & narrative", "Financial model", "Investor list & intros"],
    packages: [
      { name: "Raise-ready", priceInr: null, priceNote: "On success", cadence: "on success", summary: "Fee tied to the raise.", includes: ["Deck", "Model", "Intros", "Process management"], featured: true },
    ],
    kind: "provider",
    verified: true,
    city: "Bangalore",
  },
  {
    slug: "forgeworks",
    name: "ForgeWorks",
    category: "technology",
    tagline: "Product & engineering pod",
    pitch: "A senior product-and-engineering pod that ships your MVP and stays to iterate.",
    deliverables: ["Product & UX", "Full-stack build", "Cloud & DevOps"],
    packages: [
      { name: "MVP sprint", priceInr: 120000, cadence: "one-time", summary: "Idea to shipped MVP.", includes: ["Product design", "Build", "Launch"], featured: true },
      { name: "Pod", priceInr: 200000, cadence: "per month", summary: "Ongoing team.", includes: ["PM + 2 engineers", "Design", "DevOps"] },
    ],
    kind: "provider",
    verified: true,
    city: "Hyderabad",
  },
  {
    slug: "datagrove",
    name: "DataGrove",
    category: "technology",
    tagline: "Data & analytics",
    pitch: "Warehouses, dashboards and event tracking set up so your team can trust its numbers.",
    deliverables: ["Warehouse setup", "Dashboards", "Event tracking"],
    packages: [
      { name: "Analytics setup", priceInr: 60000, cadence: "one-time", summary: "Trustworthy metrics.", includes: ["Warehouse", "Tracking plan", "Core dashboards"] },
    ],
    kind: "provider",
    verified: true,
    city: "Chennai",
  },
];

/** WeCos first, then providers. */
export const listings: Listing[] = [...wecosListings, ...providerListings];

export const listingBySlug = (slug: string) =>
  listings.find((l) => l.slug === slug);

/** Category members, WeCos first. */
export const listingsByCategory = (categorySlug: string) =>
  listings
    .filter((l) => l.category === categorySlug)
    .sort((a, b) => (a.kind === "wecos" ? -1 : 0) - (b.kind === "wecos" ? -1 : 0));

/** From-price for a listing card. `null` = success/quote-based. */
export const fromPrice = (l: Listing) =>
  l.packages
    .map((p) => p.priceInr)
    .filter((p): p is number => p !== null)
    .sort((a, b) => a - b)[0] ?? null;

/**
 * Adapt a listing into the shared startup CompanyPage shape, so a studio's
 * business page renders with the exact same layout as a startup page. Rich
 * sections we have no data for (team, funding, reviews) stay empty and hide.
 */
export function listingToCompanyData(l: Listing): CompanyPageData {
  const cat = categoryBySlug(l.category);
  return {
    slug: l.slug,
    name: l.name,
    verified: l.verified || l.kind === "wecos",
    tagline: l.tagline,
    industry: cat?.label,
    location: l.city,
    about: l.pitch,
    logoText: l.name.charAt(0).toUpperCase(),
    topics: cat ? [cat.label] : undefined,
    overview: {
      industry: cat?.label,
      headquarters: l.city,
      type: l.kind === "wecos" ? "WeCos Studio" : "Verified Provider",
      specialties: l.deliverables,
    },
    products: l.packages.map((p) => ({
      name: p.name,
      description: p.summary,
      tag:
        p.priceInr != null
          ? `${formatInr(p.priceInr)} · ${p.cadence}`
          : p.priceNote ?? "On request",
    })),
  };
}
