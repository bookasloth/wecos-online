/**
 * Single source of truth for site-wide structured content.
 *
 * IMPORTANT: cities and studios were inconsistent across the navbar, homepage,
 * and footer in the source brief. They are canonicalized here ONCE — every nav,
 * footer, and directory reads from this file. Edit here, it updates everywhere.
 */

export const siteConfig = {
  name: "WeCos",
  legalName: "The Grey Hawks x WeCos",
  tagline: "India's Startup Engine",
  description:
    "Build better, prove faster, grow stronger. WeCos helps founders turn ideas into validated startups — powered by AI systems and guided by human mentors.",
  /**
   * The one canonical origin. Website, app and email all live here — used for
   * `metadataBase`, canonical URLs, the sitemap, and absolute links and images
   * inside transactional emails.
   *
   * Serve `www.wecos.in` as a redirect to this, not as a second origin.
   */
  url: "https://wecos.in",
  email: "start@wecos.in",
} as const;

/**
 * Downloadable documents offered by the company enquiry form.
 *
 * Single source of truth: the client renders the picker from `label`, and the
 * API route derives the download href from `path` server-side. Never accept a
 * document link from the request body — see the route for why.
 */
export const enquiryDocuments = [
  {
    label: "Company Profile",
    path: "/documents/company-profile.pdf",
    subject: "Your Company Profile is ready",
    title: "Download Company Profile",
    description:
      "Thank you for requesting the company profile. This document contains the company overview, services and capabilities.",
    button: "Download Company Profile",
  },
  {
    label: "Brochure",
    path: "/documents/brochure.pdf",
    subject: "Your Brochure is ready",
    title: "Download Brochure",
    description:
      "Thank you for requesting the brochure. Explore the products and services in detail.",
    button: "Download Brochure",
  },
  {
    label: "Pitch Deck",
    path: "/documents/pitch-deck.pdf",
    subject: "Your Pitch Deck is ready",
    title: "Download Pitch Deck",
    description:
      "Thank you for requesting the pitch deck. Explore the vision, business model and growth plans.",
    button: "Download Pitch Deck",
  },
  {
    label: "Catalogue",
    path: "/documents/catalogue.pdf",
    subject: "Your Catalogue is ready",
    title: "Download Catalogue",
    description:
      "Thank you for requesting the catalogue. Browse the complete offerings.",
    button: "Download Catalogue",
  },
  {
    label: "Rate Card",
    path: "/documents/rate-card.pdf",
    subject: "Your Rate Card is ready",
    title: "Download Rate Card",
    description: "Thank you for requesting the latest pricing information.",
    button: "Download Rate Card",
  },
] as const;

export type EnquiryDocumentLabel = (typeof enquiryDocuments)[number]["label"];

/**
 * Membership tiers. Single source of truth for every price shown anywhere.
 *
 * All prices are ANNUAL and in INR. This supersedes the WeCos 2.0 deck's single
 * ₹3,650/year membership — see docs/FEATURES.md for the feature matrix and
 * docs/ASSUMPTIONS.md for what the change does to the revenue plan.
 *
 * Entitlements are NOT defined here. Tier capabilities live in the entitlement
 * layer (docs/AUTHORIZATION.md) so packaging can change without touching prices.
 */
export const tiers = [
  {
    id: "free",
    name: "Free",
    priceInr: 0,
    promise: "Be here",
    summary: "Your profile, the feed, and the whole directory.",
  },
  {
    id: "network",
    name: "Solo",
    priceInr: 499,
    promise: "Be known",
    summary: "Reach any founder on WeCos, and be reachable back.",
  },
  {
    id: "venture",
    name: "Venture",
    priceInr: 1299,
    promise: "Be found",
    summary: "List your startup, collect leads, get discounted studios.",
    featured: true,
  },
  {
    id: "circle",
    name: "Studio",
    priceInr: 1999,
    promise: "Be the reason people come",
    summary: "Host events and chapters, plus every partner perk.",
  },
] as const;

export type TierId = (typeof tiers)[number]["id"];
export type Tier = (typeof tiers)[number];

export const tierById = (id: TierId) => tiers.find((t) => t.id === id)!;

/** The tier we lead with in marketing — the one most founders should buy. */
export const featuredTier = tiers.find((t) => "featured" in t && t.featured)!;

/** Cheapest paid tier. Used for "from ₹X" copy. */
export const entryTier = tierById("network");

/** Membership constants that aren't a tier price. */
export const pricing = {
  /** Stated total value of member benefits in INR. */
  valueInr: 73500,
  /** Founding-member cap. Restricted to Venture and above. */
  foundingSeats: 500,
  /** Minimum tier that can claim a founding seat. */
  foundingSeatMinTier: "venture" as TierId,
} as const;

/** Studio discount by tier. Members pay less; the gap is the upgrade argument. */
export const studioDiscountPct: Record<TierId, number> = {
  free: 0,
  network: 5,
  venture: 15,
  circle: 25,
};

export type City = {
  slug: string;
  name: string;
  /** Whether a Coffee Club chapter is live (vs. coming soon). */
  active: boolean;
};

/**
 * Canonical Coffee Club cities. NOTE: brief listed three different city sets
 * (navbar vs homepage vs footer). This is the reconciled launch list — confirm
 * with stakeholders before print/marketing.
 */
export const cities: City[] = [
  { slug: "mumbai", name: "Mumbai", active: true },
  { slug: "pune", name: "Pune", active: true },
  { slug: "bangalore", name: "Bangalore", active: true },
  { slug: "nagpur", name: "Nagpur", active: true },
  { slug: "bhubaneswar", name: "Bhubaneswar", active: true },
];

export type StudioPackage = {
  name: string;
  /** Price in INR. `null` = quoted per engagement (Capital Circle works on a fee). */
  priceInr: number | null;
  /** Shown instead of a price when `priceInr` is null. */
  priceNote?: string;
  cadence: "one-time" | "per month" | "per hire" | "on success";
  summary: string;
  includes: string[];
  /** Marks the package the studio leads with. One per studio. */
  featured?: boolean;
};

export type Studio = {
  slug: string;
  name: string;
  /** Short service summary for cards / nav descriptions. */
  summary: string;
  /** One-line positioning used as the landing-page hero subtitle. */
  pitch: string;
  /** What the studio actually delivers — the bullet list on the landing page. */
  deliverables: string[];
  packages: StudioPackage[];
  /** Year-1 plan targets from the WeCos 2.0 deck. Used on internal/pricing copy. */
  target: { avgDealInr: number | null; clients: number };
  /** Slugs this studio previously lived at, for redirects. */
  legacySlugs?: string[];
};

/**
 * WeCos Studios — the in-house service arms from the WeCos 2.0 deck (slide 6).
 * These are profit centers that sell to members, NOT directory categories; the
 * startup directory's category filter lives on /startups.
 *
 * Deal values and client targets are the deck's Year-1 plan.
 *
 * ⚠️ Technology Studio is not in the deck — it has no stated deal value or client
 * target there. The numbers below are placeholders; confirm before using them in
 * any financial or sales material.
 */
export const studios: Studio[] = [
  {
    slug: "marketing",
    name: "Marketing Studio",
    summary: "Ads, SEO, content & automation",
    pitch:
      "Growth that compounds — paid, organic and lifecycle run by one team that already knows your startup.",
    deliverables: [
      "Paid acquisition across Meta, Google and LinkedIn",
      "SEO foundations, content calendar and publishing",
      "Lifecycle email and marketing automation",
      "Landing pages and conversion tracking",
      "Monthly growth report with next actions",
    ],
    target: { avgDealInr: 25000, clients: 40 },
    packages: [
      {
        name: "Launch",
        priceInr: 15000,
        cadence: "per month",
        summary: "Get your first channel working.",
        includes: ["1 paid channel", "4 content pieces / month", "Landing page", "Monthly report"],
      },
      {
        name: "Growth",
        priceInr: 25000,
        cadence: "per month",
        summary: "The full growth stack, run for you.",
        includes: [
          "2 paid channels",
          "8 content pieces / month",
          "SEO + technical fixes",
          "Lifecycle email",
          "Bi-weekly review call",
        ],
        featured: true,
      },
      {
        name: "Scale",
        priceInr: 50000,
        cadence: "per month",
        summary: "Dedicated pod for startups past product-market fit.",
        includes: [
          "All channels",
          "Dedicated strategist",
          "Creative production",
          "Weekly review call",
          "Attribution dashboard",
        ],
      },
    ],
  },
  {
    slug: "hr",
    name: "HR Studio",
    summary: "Recruitment, payroll & policy",
    pitch:
      "Hire well and stay compliant without building an HR function you're not ready for.",
    deliverables: [
      "Role scoping, sourcing and screening",
      "Interview process and scorecards",
      "Offer letters and onboarding kits",
      "Payroll setup and monthly run",
      "Policy handbook and POSH compliance",
    ],
    target: { avgDealInr: 15000, clients: 20 },
    legacySlugs: ["human-resource"],
    packages: [
      {
        name: "Hiring Sprint",
        priceInr: 15000,
        cadence: "per hire",
        summary: "One role, filled properly.",
        includes: ["Role scoping", "Sourcing + screening", "Interview kit", "Offer support"],
        featured: true,
      },
      {
        name: "People Ops",
        priceInr: 20000,
        cadence: "per month",
        summary: "Payroll, policy and compliance handled.",
        includes: ["Monthly payroll", "Policy handbook", "POSH compliance", "Onboarding kits"],
      },
      {
        name: "Foundation",
        priceInr: 25000,
        cadence: "one-time",
        summary: "Set up the whole people function once.",
        includes: [
          "Org design",
          "Comp bands",
          "Handbook + contracts",
          "Payroll setup",
          "Hiring playbook",
        ],
      },
    ],
  },
  {
    slug: "finance",
    name: "Finance Studio",
    summary: "Accounting, taxation & CFO services",
    pitch:
      "Books you can raise on — clean, current, and explained in plain language every month.",
    deliverables: [
      "Monthly bookkeeping and reconciliation",
      "GST, TDS and income-tax filings",
      "Cash-flow and runway modelling",
      "Investor-ready MIS pack",
      "Fractional CFO reviews",
    ],
    target: { avgDealInr: 20000, clients: 15 },
    legacySlugs: ["accounting"],
    packages: [
      {
        name: "Books",
        priceInr: 8000,
        cadence: "per month",
        summary: "Stay clean and compliant.",
        includes: ["Monthly bookkeeping", "GST + TDS filings", "Bank reconciliation"],
      },
      {
        name: "Books + MIS",
        priceInr: 20000,
        cadence: "per month",
        summary: "Add the numbers investors ask for.",
        includes: [
          "Everything in Books",
          "Monthly MIS pack",
          "Runway + burn model",
          "Quarterly review call",
        ],
        featured: true,
      },
      {
        name: "Fractional CFO",
        priceInr: 45000,
        cadence: "per month",
        summary: "A finance lead without a finance hire.",
        includes: [
          "Everything in Books + MIS",
          "Board pack",
          "Fundraise modelling",
          "Monthly CFO call",
        ],
      },
    ],
  },
  {
    slug: "legal",
    name: "Legal Studio",
    summary: "Registrations, contracts & IP",
    pitch:
      "Incorporate, contract and protect — the legal work every startup needs, at startup prices.",
    deliverables: [
      "Incorporation and ROC compliance",
      "Founder and ESOP agreements",
      "Customer, vendor and employment contracts",
      "Trademark and IP filings",
      "Privacy policy and terms",
    ],
    target: { avgDealInr: 10000, clients: 15 },
    packages: [
      {
        name: "Incorporate",
        priceInr: 10000,
        cadence: "one-time",
        summary: "Get registered, properly.",
        includes: ["Pvt Ltd / LLP registration", "PAN + TAN", "Founder agreement", "MOA / AOA"],
        featured: true,
      },
      {
        name: "Contracts",
        priceInr: 12000,
        cadence: "one-time",
        summary: "The paperwork that protects revenue.",
        includes: ["Customer MSA", "Vendor agreement", "Employment contracts", "NDA set"],
      },
      {
        name: "Compliance Retainer",
        priceInr: 15000,
        cadence: "per month",
        summary: "Ongoing cover so nothing lapses.",
        includes: ["ROC filings", "Contract reviews", "IP monitoring", "Advisory hours"],
      },
    ],
  },
  {
    slug: "capital-circle",
    name: "Capital Circle",
    summary: "Investor access & funding facilitation",
    pitch:
      "Warm introductions, a deck that holds up, and a process that doesn't burn six months.",
    deliverables: [
      "Pitch narrative and deck rebuild",
      "Financial model and data room",
      "Curated investor list",
      "Warm introductions from the WeCos network",
      "Diligence and term-sheet support",
    ],
    target: { avgDealInr: null, clients: 10 },
    packages: [
      {
        name: "Raise Ready",
        priceInr: 35000,
        cadence: "one-time",
        summary: "Get the material investor-grade before you start.",
        includes: ["Deck rebuild", "Financial model", "Data room setup", "Narrative coaching"],
      },
      {
        name: "Capital Circle",
        priceInr: null,
        priceNote: "Success fee",
        cadence: "on success",
        summary: "We run the raise alongside you.",
        includes: [
          "Everything in Raise Ready",
          "Curated investor list",
          "Warm introductions",
          "Diligence support",
          "Term-sheet review",
        ],
        featured: true,
      },
    ],
  },
  {
    slug: "technology",
    name: "Technology Studio",
    summary: "Product, engineering & automation",
    pitch:
      "Ship the product instead of hiring for it — design, build and automate with a team that starts on Monday.",
    deliverables: [
      "Product discovery and scoping",
      "UI/UX design",
      "Web and mobile development",
      "Internal tooling and automation",
      "Maintenance and support",
    ],
    // ⚠️ Not in the WeCos 2.0 deck — placeholder economics, confirm before use.
    target: { avgDealInr: 50000, clients: 20 },
    packages: [
      {
        name: "Prototype",
        priceInr: 40000,
        cadence: "one-time",
        summary: "A clickable product to test and show.",
        includes: ["Discovery workshop", "UX flows", "High-fidelity prototype", "Handoff files"],
      },
      {
        name: "MVP Build",
        priceInr: 150000,
        cadence: "one-time",
        summary: "A real product, live, in weeks.",
        includes: ["Full design", "Web app build", "Auth + payments", "Deploy + analytics"],
        featured: true,
      },
      {
        name: "Product Retainer",
        priceInr: 50000,
        cadence: "per month",
        summary: "Keep shipping after launch.",
        includes: ["Ongoing development", "Bug fixes + support", "Monthly roadmap", "Automation work"],
      },
    ],
  },
];

/**
 * The headline discount used in marketing copy ("members pay up to X% less").
 * Derived from the ladder so it can never drift from the real entitlement.
 */
export const memberDiscountPct = Math.max(...Object.values(studioDiscountPct));

export const studioBySlug = (slug: string) =>
  studios.find((s) => s.slug === slug || s.legacySlugs?.includes(slug));

/**
 * Handles live at the root of the URL space (`/username`), so they share a
 * namespace with every top-level route. Anything in this set must never be
 * claimable as a username — a founder who registered `about` would own a URL
 * that can never resolve to their profile, because static routes always win.
 *
 * ⚠️ ADD TO THIS LIST BEFORE ADDING ANY TOP-LEVEL ROUTE. Adding `/pricing` after
 * someone has taken the handle `pricing` silently breaks their profile URL.
 *
 * Includes current routes, obvious future ones, and words we don't want
 * impersonated (admin, support, official…).
 */
export const reservedHandles = new Set([
  // current routes
  "about", "coffee-clubs", "founders", "membership", "resources", "startups",
  "studios", "validate", "startup", "feed", "dashboard",
  "onboarding", "sign-in", "sign-up", "forgot-password", "reset-password", "api",
  "robots.txt", "sitemap.xml", "favicon.ico",
  // likely future routes
  "pricing", "blog", "help", "docs", "events", "marketplace", "jobs", "search",
  "explore", "settings", "account", "notifications", "messages", "u", "startup",
  "capital", "circles", "chapters", "bootcamps", "toolkits", "spotlight",
  // impersonation risks
  "admin", "administrator", "support", "official", "wecos", "team", "staff",
  "root", "system", "security", "billing", "legal", "privacy", "terms",
  "contact", "careers", "press", "info", "help-center", "null", "undefined",
]);

/** Handle rules: 2–39 chars, alphanumeric plus `_` and `-`, must start alphanumeric. */
export const handlePattern = /^[a-z0-9][a-z0-9_-]{1,38}$/;

/** True when `handle` is a well-formed, non-reserved username. */
export function isValidHandle(handle: string) {
  const h = handle.toLowerCase();
  return handlePattern.test(h) && !reservedHandles.has(h);
}

export type ResourceLink = { slug: string; name: string; summary: string };

export const resources: ResourceLink[] = [
  { slug: "blog", name: "Blog", summary: "Founder stories & insights" },
  { slug: "toolkits", name: "Toolkits", summary: "Templates, trackers & playbooks" },
  { slug: "free", name: "Free Stuff", summary: "Quizzes, guides & lead magnets" },
];

/** Top-level marketing navigation. Dropdown items are derived from the lists above. */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; summary?: string }[];
};

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  { label: "About", href: "/about" },
  {
    label: "Discover",
    href: "/startups",
    children: [
      { label: "Startups", href: "/startups", summary: "Browse the startup directory" },
      { label: "Founders", href: "/founders", summary: "Meet founders on WeCos" },
    ],
  },
  { label: "Membership", href: "/membership" },
  {
    label: "Coffee Clubs",
    href: "/coffee-clubs",
    children: cities.map((c) => ({
      label: c.name,
      href: `/coffee-clubs/${c.slug}`,
    })),
  },
  {
    label: "Resources",
    href: "/resources",
    children: resources.map((r) => ({
      label: r.name,
      href: `/resources/${r.slug}`,
      summary: r.summary,
    })),
  },
  {
    label: "Studios",
    href: "/studios",
    children: studios.map((s) => ({
      label: s.name,
      href: `/studios/${s.slug}`,
      summary: s.summary,
    })),
  },
];
