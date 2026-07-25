"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StudioEnquiry } from "@/features/studios/studio-enquiry";
import {
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  Rocket,
  TrendingUp,
  Star,
  ShieldCheck,
  Clock,
  Users,
  Building2,
  Play,
  MapPin,
  Download,
  AlarmClockCheck,
  FileText,
  Globe,
  Heart,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export type CompanyReview = {
  client: string;
  company: string;
  rating: number;
  review: string;
  video?: string;
  verticalVideo?: string;

};

export type CompanyUpdate = {
  text: string;
  date: string;
  likes: number;
  comments: number;
  reposts?: number;
};
export type CompanyLeader = { name: string; role: string; handle?: string; avatarText: string };
export type CompanyJob = { title: string; location: string; type: string };
export type CompanyStat = { label: string; value: string };
export type CompanyLink = { label: string; href: string };
export type CompanyProduct = { name: string; description?: string; tag?: string ;  image?: string;};
export type CompanyFunding = {
  totalRaised?: string;
  valuation?: string;
  lastRound?: string;
  investors?: string[];
};
export type CompanyTraction = {
  title?: string;
  points: { label: string; value: number }[];
};
export type CompanyPerson = { name: string; role: string; handle?: string; avatarText: string;image?: string; bio?: string;};
export type CompanyPageData = {
  slug: string;
  name: string;
  verified?: boolean;
  tagline: string;
  industry?: string;
  location?: string;
  about?: string;
  logoText: string;
  logoUrl?: string;
  coverImage?: string;
  bannerClass?: string;
  followers?: number;
  employeesLabel?: string;
  website?: string;
  upvotes?: number;
  commentsCount?: number;
  topics?: string[];
  overview: {
    website?: string;
    industry?: string;
    companySize?: string;
    headquarters?: string;
    founded?: string;
    type?: string;
    specialties?: string[];
  };
  products?: CompanyProduct[];
  funding?: CompanyFunding;
  traction?: CompanyTraction;
  updates?: CompanyUpdate[];
  jobs?: CompanyJob[];
  leadership?: CompanyLeader[];
  people?: CompanyPerson[];
  stats?: CompanyStat[];
  alsoViewed?: { name: string; slug: string; industry: string; logoText: string }[];
  links?: CompanyLink[];
  reviews?: CompanyReview[];
};

const compact = (n?: number) =>
  n == null
    ? undefined
    : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);


function Card({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card", className)} {...props}>
      {children}
    </div>
  );
}

export function CompanyPage({ data }: { data: CompanyPageData }) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const [selectedDocument, setSelectedDocument] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [activeNav, setActiveNav] = useState("");

  // Scrollspy — highlight the in-page nav item for the section on screen.
  useEffect(() => {
    const ids = ["overview", "services", "proof", "team", "reviews"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveNav(top.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const videoModalRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLParagraphElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clears the "close the modal in 2s" timer if the page unmounts first,
  // so the success handler never sets state on an unmounted tree.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

useEffect(() => {
  if (!activeVideo) return;

  videoModalRef.current?.focus();

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveVideo(null);
    }
  };

  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
}, [activeVideo]);

// Shows the "read more" toggle only when the about copy overflows 8 lines.
// (There used to be a second effect here computing the same flag from
// clientHeight; it always lost the race to this one, so it was dead code.)
useEffect(() => {
  const el = aboutRef.current;

  if (!el) return;

  requestAnimationFrame(() => {
    const lineHeight = parseFloat(
      window.getComputedStyle(el).lineHeight
    );

    const maxHeight = lineHeight * 8;

    setShowReadMore(el.scrollHeight > maxHeight);
  });
}, [data.about]);

  const show = {
  overview: true,
  stats: !!data.stats?.length,
  traction: !!data.traction?.points.length,
  funding: !!data.funding,
  products: !!data.products?.length,
  updates: !!data.updates?.length,
  jobs: !!data.jobs?.length,
  people: !!data.people?.length,
  reviews: !!data.reviews?.length,
};

// Order matches the on-page scroll order so the scrollspy highlight moves
// monotonically. (Physically moving "Track record" above Team is a separate
// follow-up.)
const navItems = [
  { id: "overview", label: "Overview", on: show.overview },
  { id: "services", label: "Services", on: show.products },
  { id: "team", label: "Team", on: show.people },
  { id: "proof", label: "Track record", on: show.stats || show.traction || show.funding },
  { id: "reviews", label: "Reviews", on: show.reviews },
].filter((x) => x.on);
const ReviewCard = ({ r, tall = false }: { r: CompanyReview; tall?: boolean }) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-card p-5 shadow-sm",
      tall && "h-full"
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-foreground">{r.client}</p>
        <p className="text-xs text-muted-foreground">{r.company}</p>
      </div>

      <div className="flex gap-0.5 text-sm text-warning">
        {Array.from({ length: r.rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-warning text-warning" />
        ))}
      </div>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      “{r.review}”
    </p>

    {r.video && (
      <button
        type="button"
        onClick={() => setActiveVideo(r.video!)}
className="group relative mt-4 w-full overflow-hidden rounded-xl border border-border"      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThCsvF6g3mCW4f3yk6h8fo0OVC1_1GkjOoZgnBuWGlnA&s=10"
          alt={`${r.client} testimonial`}
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute inset-0 grid place-items-center bg-black/30">
          <span className="grid size-14 place-items-center rounded-full bg-card  text-primary shadow-lg">
            <Play className="size-6 fill-primary" />
          </span>
        </span>
      </button>
    )}

    {r.verticalVideo && (
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setActiveVideo(r.verticalVideo!)}
className="group relative w-[180px] overflow-hidden rounded-2xl border border-border"        >
          <img
            src="https://img.youtube.com/vi/9gmhdP82l3k/maxresdefault.jpg"
            alt={`${r.client} short testimonial`}
            className="aspect-[9/16] w-full object-cover transition duration-300 group-hover:scale-105"
          />

          <span className="absolute inset-0 grid place-items-center bg-black/30">
            <span className="grid size-12 place-items-center rounded-full bg-card  text-primary shadow-lg">
              <Play className="size-5 fill-primary" />
            </span>
          </span>
        </button>
      </div>
    )}
  </div>
);


  return (
<div className="mx-auto w-full max-w-7xl bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
      {/* Header */}
<section className="w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
    <div className="relative z-10 ">
      {/* Page like — Facebook-style. Local only for now; the count will be
          wired to the backend later. */}
      <button
        type="button"
        aria-label={isFavorite ? "Unlike this page" : "Like this page"}
        onClick={() => {
          setIsFavorite(!isFavorite);
          setAnimateHeart(true);
          setTimeout(() => setAnimateHeart(false), 600);
        }}
        className="absolute top-0 right-0 z-20 grid size-11 place-items-center overflow-visible rounded-full transition-colors"
      >
        {animateHeart && (
          <>
            <span className="heart-particle top-[-18px] left-1/2" style={{ "--tx": "0px", "--ty": "-40px" } as React.CSSProperties}>
              <Heart className="size-3 fill-destructive text-destructive" />
            </span>
            <span className="heart-particle left-[-22px] top-1/2" style={{ "--tx": "-35px", "--ty": "-10px" } as React.CSSProperties}>
              <Heart className="size-3 fill-destructive text-destructive" />
            </span>
            <span className="heart-particle right-[-22px] top-1/2" style={{ "--tx": "35px", "--ty": "-10px" } as React.CSSProperties}>
              <Heart className="size-3 fill-destructive text-destructive" />
            </span>
            <span className="heart-particle left-[-10px] bottom-[-18px]" style={{ "--tx": "-25px", "--ty": "25px" } as React.CSSProperties}>
              <Heart className="size-3 fill-destructive text-destructive" />
            </span>
            <span className="heart-particle right-[-10px] bottom-[-18px]" style={{ "--tx": "25px", "--ty": "25px" } as React.CSSProperties}>
              <Heart className="size-3 fill-destructive text-destructive" />
            </span>
          </>
        )}
        <span
          className={cn(
            "grid size-11 place-items-center rounded-full transition-all duration-300",
            isFavorite ? "scale-110 bg-destructive/10" : "bg-muted hover:bg-destructive/10",
          )}
        >
          <Heart
            className={cn(
              "size-5 transition-all duration-300",
              animateHeart && "animate-heart",
              isFavorite ? "scale-125 fill-destructive text-destructive" : "text-muted-foreground",
            )}
          />
        </span>
      </button>

<div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-start">
   <div className="grid size-25 place-items-center rounded-full border-4 border-background bg-card shadow-lg">
  {data.logoUrl ? (
    <img
      src={data.logoUrl}
      alt={data.name}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
<span className="text-2xl font-bold tracking-widest text-foreground">
        {data.logoText}
    </span>
  )}
</div>

      <div className="min-w-0">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{data.name}</h1>
          {data.verified ? (
<span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">              <BadgeCheck className="size-4" />
              Verified Business
            </span>
          ) : null}
        </div>

        <div className="mt-4 w-full max-w-full rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground break-words sm:inline-flex sm:w-auto">
  Industry: {data.overview.industry}
</div>
      </div>
    </div>

    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
<StudioEnquiry
  studioName={data.name}
  label="Enquire Now"
  className="w-full rounded-xl px-8 shadow-lg sm:w-auto"
/>

<a
  href="https://www.bookasloth.com"
  target="_blank"
  rel="noopener noreferrer"
className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto">
  <CalendarDays className="size-4" />
  Book a Meeting
</a>
    </div>
  </div>

</section>

          {navItems.length > 1 && (
            <nav className="sticky top-16 z-30 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card/90 px-2 py-1.5 shadow-sm backdrop-blur">
              {navItems.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    activeNav === n.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          )}

          {/* Overview */}
          {show.overview && (
            <Card id="overview" className="scroll-mt-28 p-5 sm:p-6">
              <h2 className="text-lg font-bold">About {data.name}</h2>
              {data.about ? (
  <>
  <p
  ref={aboutRef}
  className={cn(
    "mt-3 break-words text-sm leading-relaxed whitespace-pre-line text-foreground/90 transition-all duration-500",
    !showFullAbout && "line-clamp-8"
  )}
>
    {data.about}
  </p>

  {showReadMore && (
    <button
      type="button"
      onClick={() => setShowFullAbout(!showFullAbout)}
      className="mt-3 text-sm font-semibold text-primary hover:text-primary/80"
    >
      {showFullAbout ? "Show Less" : "Read More"}
    </button>
  )}
</>
) : null}
            </Card>
          )}

<Card className="overflow-hidden">
  <div className="space-y-10 p-5 sm:p-6">
    {show.products && (
      <div id="services" className="scroll-mt-28">
        <h2 className="text-lg font-bold">Our Services</h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {data.products!.map((p) => {
            return (
              <div
                key={p.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-hover:border-border"
              >
                <div className="absolute " />

                <div className="mb-5 flex items-start justify-between gap-6">
  <div>
    <h3 className="text-lg font-bold text-foreground">
      {p.name}
    </h3>
  </div>
</div>

                {p.description && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {p.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-end">
<StudioEnquiry
  studioName={data.name}
  packageName={p.name}
  label="Enquire"
  variant="link"
  className="h-auto p-0 text-sm font-semibold"
/>
</div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {show.people && (
  <div id="team" className="scroll-mt-28">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold">Our Team</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Meet the leaders behind our success.
        </p>
      </div>

      
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.people!.map((m, index) => {
        const colors = [
          "from-primary/20 to-primary/10 text-primary",
          "from-info/20 to-info/10 text-info",
          "from-orange-500/20 to-orange-500/10 text-orange-500",
          "from-success/20 to-success/10 text-success",
          "from-pink-500/20 to-pink-500/10 text-pink-500",
          "from-brand-indigo/20 to-brand-indigo/10 text-brand-indigo",
        ];

        return (
          <div
            key={m.name}
  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/40"
>
<div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm">
    {m.image ? (
    <img
      src={m.image}
      alt={m.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div
      className={cn(
        "grid h-full w-full place-items-center bg-gradient-to-br text-sm font-bold",
        colors[index % colors.length]
      )}
    >
      {m.avatarText}
    </div>
  )}
</div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{m.name}</p>
              <p className="truncate text-xs text-muted-foreground">{m.role}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

    {/* Removed: hardcoded SpaceX client logos (placeholder). */}
    {false && (
  <div>
    <h2 className="text-lg font-bold">Our Clients</h2>

    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
      {[
        {
          name: "NASA",
          logo:"/nasa.svg",
        },
        {
          name: "USSF",
          logo:"/usssf.svg",
        },
        {
          name: "Google",
          logo:"/google.svg",
        },
        {
          name: "OneWeb",
          logo:"/oneweb.svg",
        },
        {
          name: "Assets",
          logo:"/assets.jpg",
        },
      ].map((client) => {
        return (
          <div
            key={client.name}
            className="
              group
              rounded-2xl
              border
              border-border
              bg-card
              p-5
              text-center
              shadow-sm
              transition-all
              duration-300
              hover:border-primary
            "
          >
           <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
  <img
    src={client.logo}
    alt={client.name}
    className="max-h-12 max-w-12 object-contain transition duration-300 group-hover:scale-110"
  />
</div>

<p className="font-bold text-foreground">
                {client.name}
            </p>
          </div>
        );
      })}
    </div>
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
   {[
  {
    icon: Users,
    value: "200+",
    label: "Clients Served",
  },
  {
    icon: Globe,
    value: "30+",
    label: "Countries",
  },
  {
    icon: Building2,
    value: "15+",
    label: "Years Experience",
  },
  {
    icon: Star,
    value: "98%",
    label: "Client Retention",
  },
].map(({ icon: Icon, value, label }) => (
  <div
    key={label}
    className="flex items-start gap-2 rounded-xl border border-border bg-card p-3"
>
<div className="mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
      <Icon className="size-5" />
    </div>

    <div className="flex min-w-0 flex-col">
      <p className="text-lg font-bold leading-none text-foreground">
        {value}
      </p>

      <p className="mt-1 whitespace-nowrap text-xs leading-tight text-muted-foreground">
  {label}
</p>
    </div>
  </div>
))}
</div>
  </div>
)}
    {show.updates && (
      <div>
        <h2 className="text-lg font-bold">Recent Updates</h2>

        <ul className="mt-3 divide-y divide-border">
          {data.updates!.map((p, i) => (
            <li key={i} className="py-4 first:pt-0 last:pb-0">
              <p className="text-sm leading-relaxed text-foreground/90">
                {p.text}
              </p>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>{compact(p.likes)} likes</span>
                <span>{compact(p.comments)} comments</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {show.jobs && (
      <div>
        <h2 className="text-lg font-bold">Open Roles</h2>

        <ul className="mt-3 divide-y divide-border">
          {data.jobs!.map((j, i) => (
            <li
              key={i}
className="flex flex-col gap-3 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"            >
              <div>
                <p className="text-sm font-medium">{j.title}</p>
                <p className="text-xs text-muted-foreground">
                  {j.location} · {j.type}
                </p>
              </div>

              <Link
                href="/sign-up"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
    {(show.stats || show.traction || show.funding) && (
  <div id="proof" className="scroll-mt-24">
    <h2 className="text-lg font-bold">Track record</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      The numbers, growth and backing behind the work.
    </p>

    {show.traction && (
      <div className="mt-6 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">{data.traction!.title}</h3>
        <div className="mt-5 flex h-32 items-end gap-2 sm:gap-4">
          {(() => {
            const max = Math.max(...data.traction!.points.map((p) => p.value)) || 1;
            return data.traction!.points.map((p) => (
              <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-2xs font-medium text-foreground">{p.value}</span>
                <div
                  className="w-full rounded-t-md bg-primary/80"
                  style={{ height: `${Math.max((p.value / max) * 100, 4)}%` }}
                />
                <span className="text-2xs text-muted-foreground">{p.label}</span>
              </div>
            ));
          })()}
        </div>
      </div>
    )}

    {show.funding && (
      <div className="mt-6 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">Funding</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-bold text-foreground">{data.funding!.totalRaised}</p>
            <p className="text-xs text-muted-foreground">Raised</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{data.funding!.valuation}</p>
            <p className="text-xs text-muted-foreground">Valuation</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{data.funding!.lastRound}</p>
            <p className="text-xs text-muted-foreground">Last round</p>
          </div>
        </div>
        {data.funding!.investors?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {data.funding!.investors.map((inv) => (
              <span key={inv} className="rounded-full border border-border bg-muted px-2.5 py-1 text-2xs font-medium text-muted-foreground">
                {inv}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    )}

    {show.stats && (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {data.stats!.map((s, index) => {
        const colors = [
          "bg-primary/10 text-primary",
          "bg-info/10 text-info",
          "bg-success/10 text-success",
          "bg-orange-500/10 text-orange-500",
          "bg-pink-500/10 text-pink-500",
          "bg-warning/10 text-warning",
        ];

        const icons = [Rocket, Users, Globe, Star, Building2, TrendingUp];
        const Icon = icons[index % icons.length];

        return (
  <div
    key={s.label}
    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 "
  >
    <div
      className={cn(
        "grid size-14 shrink-0 place-items-center rounded-2xl",
        colors[index % colors.length]
      )}
    >
      <Icon className="size-7" />
    </div>

    <div className="min-w-0">
      <p className="text-xl font-bold leading-none text-foreground">
        {s.value}
      </p>

      <p className="mt-2 text-sm leading-tight text-muted-foreground">
        {s.label}
      </p>
    </div>
  </div>
);
      })}
    </div>
    )}
  </div>
)}
{/* Removed: hardcoded operating-centres block (placeholder). */}
{false && (
  <div>
    <h2 className="text-lg font-bold">Operations</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Operating centres and key locations.
    </p>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          title: "Hawthorne HQ",
          location: "California, USA",
          type: "Headquarters",
        },
        {
          title: "Starbase",
          location: "Texas, USA",
          type: "Launch & Testing Centre",
        },
        {
          title: "Cape Canaveral",
          location: "Florida, USA",
          type: "Launch Operations",
        },
      ].map((item) => (
        <div
  key={item.title}
  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
>
  <div className="flex items-start gap-4">
    {/* Icon */}
    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
      <MapPin className="size-6" />
    </div>

    {/* Title + Location */}
    <div className="min-w-0">
      <h3 className="font-bold text-foreground">
        {item.title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {item.location}
      </p>

    </div>
  </div>
</div>
      ))}
    </div>
  </div>
)}
  </div>
</Card>      
{/*Documents */}
<Card className="p-5 sm:p-6">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-lg font-bold">Documents</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Download key documents and resources.
      </p>
    </div>
  </div>

  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        name: "Company Profile",
        color: "from-destructive/20 to-destructive/10",
        text: "text-destructive",
      },
      {
        name: "Brochure",
        color: "from-orange-500/20 to-orange-500/10",
        text: "text-orange-500",
      },
      {
        name: "Pitch Deck",
        color: "from-warning/20 to-warning/10",
        text: "text-warning",
      },
      {
        name: "Catalogue",
        color: "from-info/20 to-info/10",
        text: "text-info",
      },
      {
        name: "Rate Card",
        color: "from-success/20 to-success/10",
        text: "text-success",
      },
    ].map((doc) => (
      <div
        key={doc.name}
        className="
          group
          rounded-2xl
          border
          border-border
          bg-card
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:border-primary
        "
      >
        {/* top */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl bg-gradient-to-br",
              doc.color,
              doc.text
            )}
          >
            <FileText className="size-5" />
          </div>

          <button
  type="button"
  onClick={() => {
    setSelectedDocument(doc.name);
    setShowEnquiryModal(true);
  }}
>
  <Download className="size-4 text-muted-foreground transition group-hover:text-primary" />
</button>
        </div>

        {/* title */}
        <p className="font-semibold text-foreground">
          {doc.name}
        </p>

        {/* type */}
        <p className="mt-1 text-xs text-muted-foreground">
          PDF Document
        </p>

        
      </div>
    ))}
  </div>
</Card>
{/* Reviews */}
{show.reviews && (
  <Card id="reviews" className="scroll-mt-28 p-5 sm:p-6">
    <h2 className="text-lg font-bold">Reviews & Testimonials</h2>

    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {/* Left column: Sarah + Jennifer */}
      <div className="grid gap-4">
        {data.reviews!
          .filter((_, i) => i !== 1)
          .map((r) => (
            <ReviewCard key={r.client} r={r} />
          ))}
      </div>

      {/* Right column: Michael */}
      <div>
        {data.reviews!
          .filter((_, i) => i === 1)
          .map((r) => (
            <ReviewCard key={r.client} r={r} tall />
          ))}
      </div>
    </div>
  </Card>
)}
        
        </div>

        {/* Right rail (persistent) */}
<aside className="min-w-0 space-y-5 lg:sticky lg:top-6">
  <Card className="p-5">
    <h3 className="text-lg font-bold">Quick Facts</h3>

    <div className="mt-5 space-y-5 text-sm">
  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted  text-primary">
      <CalendarDays className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Founded</p>
      <p className="text-muted-foreground">
        {data.overview.founded}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted  text-primary">
      <MapPin className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Headquarters</p>
      <p className="text-muted-foreground">
        {data.overview.headquarters}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-primary">
      <Building2 className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Business Type</p>
      <p className="text-muted-foreground">
        {data.overview.type}
      </p>
    </div>
  </div>

  <div className="flex gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted  text-primary">
      <ExternalLink className="size-5" />
    </div>

    <div>
      <p className="font-semibold">Website</p>

      <a
        href={data.website}
        target="_blank"
        className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
      >
        {data.website?.replace(/^https?:\/\//, "")}
      </a>
    </div>
  </div>
  <div className="mt-6 border-t pt-5">
 <p className="mb-3 text-sm font-semibold text-foreground">
    Social Presence
  </p>

  <div className="flex flex-wrap gap-2">
    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] transition hover:scale-105"
    >
      <FaLinkedinIn className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-pink-500/10 text-pink-500 transition hover:scale-105"
    >
      <FaInstagram className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-info/10 text-info transition hover:scale-105"
    >
      <FaFacebookF className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-muted text-foreground transition hover:scale-105"
    >
      <FaXTwitter className="text-base" />
    </a>

    <a
      href="#"
      className="grid size-10 place-items-center rounded-xl bg-destructive/10 text-destructive transition hover:scale-105"
    >
      <FaYoutube className="text-base" />
    </a>
  </div>
</div>
</div>
  </Card>

  <Card className="p-5">
    <h3 className="text-lg font-bold">Contact {data.name}</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Send an enquiry and {data.name} will get back to you, usually within a
      working day.
    </p>

    <StudioEnquiry studioName={data.name} label="Contact" className="mt-5 w-full" />

    <a
      href="https://www.bookasloth.com"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border py-2.5 text-sm font-semibold transition hover:bg-muted"
    >
      <CalendarDays className="size-4" />
      Book a Meeting
    </a>
  </Card>
  <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
  <h3 className="mb-4 text-base font-bold">
    WeCos Trust Indicators
  </h3>

  <div className="space-y-2.5">
    {[
  {
    label: "Verified Business",
    value: "Verified",
    icon: BadgeCheck,
    color: "bg-success/10 text-success",
  },
  {
    label: "KYC Verified",
    value: "Verified",
    icon:   ShieldCheck,
    color: "bg-info/10 text-info",
  },
  {
    label: "Active Since",
    value: "2024",
    icon: CalendarDays,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Response Time",
    value: "2h",
    icon: Clock,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    label: "Projects",
    value: "120+",
    icon: Rocket,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    label: "Repeat Rate",
    value: "85%",
    icon: Users,
    color: "bg-brand-indigo/10 text-brand-indigo",
  },
  {
    label: "On-Time",
    value: "96%",
    icon: AlarmClockCheck,
    color: "bg-success/10 text-success",
  },
  {
    label: "Rating",
    value: "4.8",
    icon: Star,
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Endorsements",
    value: "120+",
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
  },
].map(({ label, value, icon: Icon, color }) => (
      <div
        key={label}
className="flex min-w-0 items-center justify-between gap-3 py-1"      >
        <div className="flex min-w-0 items-center gap-2">
          <div
  className={cn(
    "grid size-7 shrink-0 place-items-center rounded-full",
    color
  )}
>
  <Icon className="size-4" />
</div>

          <span className="min-w-0 truncate text-xs text-muted-foreground">
            {label}
          </span>
        </div>

        <span className="ml-2 shrink-0 text-xs font-semibold text-foreground">
          {value}
        </span>
      </div>
    ))}
  </div>
</Card>
</aside>
{showEnquiryModal && (
  <Modal
    title="Send Enquiry"
    onClose={() => setShowEnquiryModal(false)}
    panelClassName="max-h-[90vh] overflow-y-auto p-5 sm:p-6"
    titleAction={
      <button
        type="button"
        aria-label="Close"
        onClick={() => setShowEnquiryModal(false)}
        className="text-2xl text-muted-foreground hover:text-foreground"
      >
        ×
      </button>
    }
  >

      <p className="mt-2 text-sm text-muted-foreground">
        {selectedDocument
  ? `Enter your email address to download ${selectedDocument}.`
  : `Enter your email address and we'll connect you with ${data.name}.`}
      </p>

      <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50"/>

{emailError && (
  <p className="mt-2 text-sm font-medium text-destructive">
    {emailError}
  </p>
)}

{successMessage && (
  <p className="mt-2 text-sm font-medium text-success">
    {successMessage}
  </p>
)}

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
    setEmailError("Please enter a valid email address.");
    return;
  }

  try {
    // The download link is derived server-side from `documentName` — sending it
    // from here would let anyone point a WeCos-branded email at any URL.
    const response = await fetch("/api/company-enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        selectedDocument
          ? {
              type: "document",
              userEmail: email,
              companyName: data.name,
              documentName: selectedDocument,
            }
          : {
              type: "enquiry",
              userEmail: email,
              companyName: data.name,
            },
      ),
    });

    if (!response.ok) {
      throw new Error("Email failed");
    }

    setSuccessMessage(
      selectedDocument
        ? "Document link has been sent to your email."
        : "Your enquiry has been submitted successfully."
    );

    closeTimerRef.current = setTimeout(() => {
      setShowEnquiryModal(false);
      setSuccessMessage("");
      setEmail("");
      setSelectedDocument("");
    }, 2000);

  } catch (err) {
    console.error(err);
    setEmailError("Failed to send email.");
  }
}}

          className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground"
        >
          Submit
        </button>
      </div>
  </Modal>
)}
      </div>
      {activeVideo && (
<div
  ref={videoModalRef}
  role="dialog"
  aria-modal="true"
  aria-label={`${data.name} testimonial video`}
  tabIndex={-1}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 outline-none"
  onClick={() => setActiveVideo(null)}
>
<div
  onClick={(e) => e.stopPropagation()}
  className={cn(
    "relative overflow-hidden rounded-2xl bg-black",
    activeVideo?.includes("9gmhdP82l3k")
      ? "w-full max-w-[360px]"
      : "w-full max-w-3xl"
  )}
>      <button
        onClick={() => setActiveVideo(null)}
        className="absolute right-4 top-3 z-10 text-3xl text-white"
      >
        ×
      </button>

      <iframe
        src={`${activeVideo}?autoplay=1`}
        title="Video testimonial"
className={
  activeVideo?.includes("9gmhdP82l3k")
    ? "aspect-[9/16] w-full"
    : "aspect-video w-full"
}        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
)}
    </div>
    
    
  );
}
