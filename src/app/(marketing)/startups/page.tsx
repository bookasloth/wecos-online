"use client";

/**
 * Startups directory — Product Hunt style: ranked, upvotable list with search,
 * sort and category filters. Reads the shared catalog; every row links to a real
 * company page. Becomes a DB query (with real votes) when the backend is wired.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Loader2,
  Search,
  Crown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layout/container";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";

/**
 * A startup as the directory renders it. Mapped from the Supabase `startups`
 * row. Only rows with `listed = true` are fetched — that flag is the public
 * expression of the owner's `venture.list` entitlement (Venture+), so free/
 * network members' pages never appear here. See docs/AUTHORIZATION.md.
 */
type DirectoryStartup = {
  slug: string;
  name: string;
  tagline: string;
  industry: string;
  topics: string[];
  logoUrl: string | null;
  upvotes: number;
  commentsCount: number;
  verified: boolean;
  overview: { founded: string };
};

const SORTS = ["Trending", "Newest", "Most discussed", "Featured"] as const;
type Sort = (typeof SORTS)[number];

const CATEGORY_CARDS = [
  "Technology",
  "Marketing",
  "Smart Hiring",
  "Compliance",
  "Accounting",
  "Funding",
  "Operations",
  "Sales",
  "Product & Strategy",
];

export default function StartupsDirectoryPage() {
  const [rows, setRows] = useState<DirectoryStartup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await createClient()
        .from("startups")
        .select(
          "slug,name,tagline,about,logo_url,topics,founded_year,verified,likes_count",
        )
        .eq("listed", true)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        console.error("[startups] fetch failed", error.message);
        setRows([]);
      } else {
        setRows(
          (data ?? []).map((s) => ({
            slug: s.slug,
            name: s.name,
            tagline: s.tagline ?? s.about ?? "",
            topics: s.topics ?? [],
            industry: s.topics?.[0] ?? "",
            logoUrl: s.logo_url,
            upvotes: s.likes_count ?? 0,
            commentsCount: 0,
            verified: !!s.verified,
            overview: { founded: s.founded_year ? String(s.founded_year) : "" },
          })),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const [query, setQuery] = useState("");
const categories = ["All", ...CATEGORY_CARDS];
const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);  const [sort, setSort] = useState<Sort>("Trending");
const [showEnquiryModal, setShowEnquiryModal] = useState(false);
const [selectedStartup, setSelectedStartup] = useState("");
const [email, setEmail] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [emailError, setEmailError] = useState("");

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const closeEnquiry = () => {
  setShowEnquiryModal(false);
  setEmail("");
  setEmailError("");
  setSuccessMessage("");
};
const toggleCategory = (c: string) => {
  if (c === "All") {
    setSelectedCategories(categories);
    return;
  }

  setSelectedCategories((prev) => {
    if (prev.includes(c)) {
      return prev.filter((item) => item !== c && item !== "All");
    }

    return [...prev.filter((item) => item !== "All"), c];
  });
};

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((s) => {
      const inCat =
  selectedCategories.includes("All") ||
  selectedCategories.length === 0 ||
  (s.topics ?? []).some((t) =>
    selectedCategories.includes(t)
  );
      const inQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        (s.topics ?? []).some((t) => t.toLowerCase().includes(q));
      return inCat && inQ;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "Newest")
        return parseInt(b.overview.founded || "0") - parseInt(a.overview.founded || "0");
      if (sort === "Most discussed") return (b.commentsCount ?? 0) - (a.commentsCount ?? 0);
      return (b.upvotes ?? 0) - (a.upvotes ?? 0);
    });
}, [rows, query, selectedCategories, sort]);

    const resetFilters = () => {
  setQuery("");
  setSelectedCategories(categories);
  setSort("Trending");
};

return (
  <Container className="py-8 sm:py-12">
    
<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
  {/* LEFT SIDE */}
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Discover Startups <span className="text-primary">•</span>
    </h1>

    <p className="mt-1.5 text-muted-foreground">
      Explore innovative startups building on WeCos.
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
  <p className="text-sm font-medium text-muted-foreground">
    Showing {list.length} startups
  </p>


  <Link
    href="/sign-in"
    className={cn(
      buttonVariants({ variant: "default" }),
      "h-10 w-full rounded-xl px-5 text-sm font-bold shadow-sm sm:w-auto"
    )}
  >
    + Submit Startup
  </Link>
</div>
  </div>
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* LEFT FILTER SIDEBAR */}
      <aside className="h-fit overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
  {/* SEARCH */}
  <div className="border-b border-border p-5">
    <h3 className="text-2xs font-bold uppercase tracking-wide text-muted-foreground">
      Search
    </h3>

    <div className="relative mt-3">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search startups..."
        className="h-10 rounded-md pl-9"
      />
    </div>
  </div>

  {/* CATEGORIES */}
  <div className="border-b border-border p-5">
    <div className="flex items-center justify-between">
      <h3 className="text-2xs font-bold uppercase tracking-wide text-muted-foreground">
        Categories
      </h3>

      <button
        type="button"
        onClick={() => setSelectedCategories([])}
        className="text-xs text-muted-foreground hover:text-primary"
      >
        Clear All
      </button>
    </div>

<div className="mt-4 space-y-3">
        {categories.map((c) => (
        <label key={c} className="flex items-center gap-3 text-sm">
  <input
  type="checkbox"
  checked={
    c === "All"
      ? selectedCategories.length === categories.length
      : selectedCategories.includes(c)
  }
  onChange={() => toggleCategory(c)}
  className="size-5 rounded-none border-border accent-primary"
/>
  <span
    className={
     (c === "All"
  ? selectedCategories.length === categories.length
  : selectedCategories.includes(c))
        ? "font-semibold text-foreground"
        : "text-muted-foreground"
    }
  >
    {c}
  </span>
</label>
      ))}
    </div>
  </div>

  {/* TRENDING */}
  <div className="border-b border-border p-5">
    <h3 className="text-2xs font-bold uppercase tracking-wide text-muted-foreground">
      Trending
    </h3>

    <div className="mt-4 space-y-3">
      {["Trending", "Most Voted", "Newest", "Featured"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setSort(item as Sort)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 text-sm transition",
            sort === item
              ? "font-semibold text-foreground"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <span
            className={cn(
              "grid size-4 place-items-center rounded-full border",
              sort === item
                ? "border-primary bg-primary"
                : "border-border"
            )}
          >
            {sort === item && (
              <span className="size-1.5 rounded-full bg-primary-foreground" />
            )}
          </span>

          {item}
        </button>
      ))}
    </div>
  </div>

  {/* RESET */}
  <div className="p-5">
    <button
      type="button"
      onClick={resetFilters}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary/40 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <RotateCcw className="size-4" />
      Reset Filters
    </button>
  </div>
</aside>

      {/* RIGHT STARTUP LIST */}
      <main>
        {loading ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border p-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            {rows.length === 0
              ? "No startups are listed yet. Founders on the Venture plan appear here."
              : "No startups match your search."}
          </div>
        ) : (
          <ul className="grid gap-5 sm:gap-6 xl:grid-cols-2">
           {list.map((s) => {
  return (
               <li
  key={s.slug}
  className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all border-1 hover:border-primary hover:shadow-md"
>

<Link
  href={`/startup/${s.slug}`}
  className="absolute inset-0 z-0"
  aria-label={`Go to ${s.name}`}
/>

<div className="relative z-10 mb-4 mt-2">
  <div className="flex justify-end">
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-2xs font-bold text-primary">
      <Crown className="size-3.5" />
    Recommended
    </span>
  </div>
</div>
{/* TOP ROW */}
<div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
<div className="flex min-w-0 items-start gap-3 sm:gap-4">    
    <div className="-mt-4 grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-muted text-2xl font-bold text-muted-foreground shadow-sm">
      {s.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={s.logoUrl}
          alt={`${s.name} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        s.name.charAt(0).toUpperCase()
      )}
    </div>

    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate text-xl font-bold leading-tight">
          {s.name}
        </span>

        {s.verified && (
          <BadgeCheck className="size-5 shrink-0 text-primary" />
        )}
        
      </div>
      

<p className="mt-1 line-clamp-1 text-sm font-medium text-muted-foreground">
          {s.industry}
      </p>
    </div>
  </div>
</div>
  {/* DESCRIPTION */}
  <p className="relative z-10 mt-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
    {s.tagline}
  </p>

  {/* TOPICS */}
<div className="relative z-10 mt-4 flex flex-wrap gap-2">
  {(s.topics ?? []).slice(0, 6).map((t) => (
    <span
      key={t}
className="rounded-full border border-border bg-muted px-2 py-0.5 text-3xs font-medium text-muted-foreground">
       {t}
    </span>
  ))}
</div>

  {/* STATS */}
  <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
    <span>Founded {s.overview.founded}</span>
    <span>•</span>
    <span>WeCos Joined</span>
  </div>

  {/* BOTTOM ROW */}
  <div className="relative z-10 mt-auto flex items-center justify-center border-t border-border pt-4">
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedStartup(s.name);
        setShowEnquiryModal(true);
      }}
      className={cn(
        buttonVariants({ variant: "default" }),
        "h-10 px-6 text-sm font-bold"
      )}
    >
      Enquire
    </button>
  </div>
</li>
  );
})}
</ul>
)}
</main>
</div>
{/* ENQUIRY MODAL */}
{showEnquiryModal && (
  <Modal
    title="Send Enquiry"
    onClose={closeEnquiry}
    titleAction={
      <button
        type="button"
        aria-label="Close"
        onClick={closeEnquiry}
        className="text-2xl text-muted-foreground hover:text-foreground"
      >
        ×
      </button>
    }
  >

      {/* DESCRIPTION */}
 <p className="mt-2 text-sm text-muted-foreground">

        Enter your email address and we&apos;ll connect you with{" "}
        <span className="font-semibold text-foreground">
          {selectedStartup}
        </span>.
      </p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50"      />

      {/* ERROR */}
      {emailError && (
        <p className="mt-2 text-sm font-medium text-destructive">
          {emailError}
        </p>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <p className="mt-2 text-sm font-medium text-success">
          {successMessage}
        </p>
      )}

      {/* BUTTONS */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={async () => {
            setEmailError("");
            setSuccessMessage("");

            if (!email.trim()) {
              setEmailError("Email address is required.");
              return;
            }

            if (!validateEmail(email)) {
              setEmailError(
                "Please enter a valid email address."
              );
              return;
            }

            try {
              const response = await fetch(
                "/api/company-enquiry",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userEmail: email,
                    companyName: selectedStartup,
                    type: "enquiry",
                  }),
                }
              );

              if (!response.ok) {
                throw new Error();
              }

              setSuccessMessage(
                "Your enquiry has been submitted successfully."
              );

              setTimeout(() => {
                setShowEnquiryModal(false);
                setSuccessMessage("");
                setEmail("");
                setSelectedStartup("");
              }, 2000);
            } catch (err) {
              console.error("[startups] enquiry failed", err);
              setEmailError("Failed to send enquiry.");
            }
          }}
          className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Submit
        </button>
      </div>
  </Modal>
)}
</Container>
);
}