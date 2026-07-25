import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  MessageSquare,
  MessageCircle,
  Plus,
  Repeat2,
  ThumbsUp,
  Trophy,
  Rocket,
  DollarSign,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type FounderExperience = {
  role: string;
  company: string;
  companyHandle?: string;
  type?: string;
  start: string;
  end?: string;
  location?: string;
  description?: string;
  logoText?: string;
};
export type FounderEducation = {
  school: string;
  degree?: string;
  field?: string;
  start?: string;
  end?: string;
  logoText?: string;
};
export type FounderActivity = {
  text: string;
  date: string;
  likes: number;
  comments: number;
  reposts?: number;
};
export type FounderLink = { label: string; href: string };
export type FounderProfileData = {
  handle: string;
  name: string;
  verified?: boolean;
  headline: string;
  location?: string;
  about?: string;
  avatarText: string;
  avatarUrl?: string;
  bannerClass?: string;
  followers?: number;
  connections?: string;
  openTo?: string[];
  currentCompany?: { name: string; handle: string; logoText: string };
  experience?: FounderExperience[];
  education?: FounderEducation[];
  skills?: string[];
  activity?: FounderActivity[];
  links?: FounderLink[];
  alsoViewed?: { name: string; handle: string; headline: string; avatarText: string }[];
};
const OPEN_TO_COLORS = [
  "border-success/20 bg-success/10 text-success",
  "border-primary/20 bg-primary/10 text-primary",
  "border-info/20 bg-info/10 text-info",
  "border-orange-500/20 bg-orange-500/10 text-orange-500",
  "border-pink-500/20 bg-pink-500/10 text-pink-500",
  "border-cyan-500/20 bg-cyan-500/10 text-cyan-500",
  "border-warning/20 bg-warning/10 text-warning",
  "border-destructive/20 bg-destructive/10 text-destructive",
];
const compact = (n?: number) =>
  n == null
    ? undefined
    : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function LogoTile({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-sm font-bold text-muted-foreground",
        className,
      )}
    >
      {text}
    </span>
  );
}

export function FounderProfile({ data }: { data: FounderProfileData }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px] items-start">
      <div className="space-y-4">
        {/* Header */}
<Card className="overflow-hidden shadow-sm">
  <div
    className={cn(
      "h-28 sm:h-36",
      data.bannerClass ?? "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900",
    )}
  />

  <div className="px-4 pb-4 sm:px-5">
    <div className="-mt-10 flex items-end justify-between gap-3">
      {data.avatarUrl ? (
        <img
          src={data.avatarUrl}
          alt={data.name}
          className="size-20 rounded-full border-4 border-card object-cover shadow-sm sm:size-24"
        />
      ) : (
        <span className="grid size-20 place-items-center rounded-full border-4 border-card bg-primary text-2xl font-bold text-primary-foreground sm:size-24">
          {data.avatarText}
        </span>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Link href="/sign-up" className={cn(buttonVariants({ variant: "default" }), "h-8 px-3 text-xs")}>
          <Plus className="size-3.5" />
          Connect
        </Link>
        <Link href="/sign-up" className={cn(buttonVariants({ variant: "outline" }), "h-8 px-3 text-xs")}>
          <MessageSquare className="size-3.5" />
          Message
        </Link>
        {data.links?.[0] && (
          <a
            href={data.links[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-8 px-3 text-xs")}
          >
            {data.links[0].label}
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </div>

    <div className="mt-3">
      <div className="flex items-center gap-1.5">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{data.name}</h1>
        {data.verified && <BadgeCheck className="size-4 text-info" />}
      </div>

      <p className="mt-1 text-sm leading-snug text-foreground/90">
        {data.headline}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {data.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {data.location}
          </span>
        )}

        {data.currentCompany && (
          <>
            <span>·</span>
            <Link href={`/startup/${data.currentCompany.handle}`} className="font-medium text-primary hover:underline">
              {data.currentCompany.name}
            </Link>
          </>
        )}
      </div>

      {(data.connections || data.followers != null) && (
        <p className="mt-1.5 text-xs">
          {data.connections && <span className="font-semibold">{data.connections} connections</span>}
          {data.followers != null && (
            <span className="text-muted-foreground">
              {data.connections ? " · " : ""}
              {compact(data.followers)} followers
            </span>
          )}
        </p>
      )}
    </div>
  </div>
</Card>

        {/* Open to */}
        {data.openTo?.length ? (
  <Card className="p-4">
    <h2 className="text-sm font-semibold">Open to</h2>
    <div className="mt-2 flex flex-wrap gap-1.5">
        {data.openTo.map((o, i) => (
  <Badge
    key={o}
    className={cn(
      "rounded-full border px-2.5 py-1 text-2xs font-medium",
      OPEN_TO_COLORS[i % OPEN_TO_COLORS.length]
    )}
  >
    {o}
  </Badge>
))}
      
    </div>
  </Card>
) : null}

        {/* About */}
        {data.about ? (
  <Card className="p-4">
    <h2 className="text-base font-semibold">About</h2>
    <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-foreground/90 sm:text-sm">
      {data.about}
    </p>
  </Card>
) : null}

        {/* Activity */}
        {data.activity?.length ? (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold">Activity</h2>
        {data.followers != null && (
          <p className="text-xs text-muted-foreground">{compact(data.followers)} followers</p>
        )}
      </div>
      <Link href="#" className="text-xs font-medium text-primary hover:underline">
        View all
      </Link>
    </div>

    <ul className="mt-3 divide-y divide-border">
      {data.activity.map((p, i) => (
        <li key={i} className="py-3 first:pt-0 last:pb-0">
          <div className="flex gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-3xs font-semibold text-white shadow-sm">
              {data.avatarText}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold">{data.name}</p>
                {data.verified && <BadgeCheck className="size-3 text-info" />}
                <span className="text-2xs text-muted-foreground">· {p.date}</span>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {p.text}
              </p>

              <div className="mt-2 flex items-center gap-4 text-2xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3" />
                  {compact(p.likes)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3" />
                  {compact(p.comments)}
                </span>
                {p.reposts != null && (
                  <span className="inline-flex items-center gap-1">
                    <Repeat2 className="size-3" />
                    {compact(p.reposts)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </Card>
) : null}

        {/* Experience */}
        {data.experience?.length ? (
  <Card className="p-4">
    <h2 className="text-base font-semibold">Experience</h2>

    <ul className="mt-3 space-y-0 border-l border-border pl-4">
      {data.experience.map((e, i) => (
        <li key={i} className="relative flex gap-2 pb-4 last:pb-0">
          <span className="absolute -left-[21px] top-2 size-2.5 rounded-full bg-primary ring-4 ring-background" />

          <LogoTile text={e.logoText ?? e.company.charAt(0)} className="size-9 text-xs" />

          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{e.role}</p>
            <p className="text-xs">
              {e.company}
              {e.type ? ` · ${e.type}` : ""}
            </p>
            <p className="text-2xs text-muted-foreground">
              {e.start} – {e.end ?? "Present"}
              {e.location ? ` · ${e.location}` : ""}
            </p>
            {e.description && (
              <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                {e.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  </Card>
) : null}

        {/* Education */}
       {data.education?.length ? (
  <Card className="p-4">
    <h2 className="text-base font-semibold">Education</h2>
    <ul className="mt-3 space-y-3">
      {data.education.map((e, i) => (
        <li key={i} className="flex gap-2">
          <LogoTile text={e.logoText ?? e.school.charAt(0)} className="size-9 text-xs" />
          <div>
            <p className="text-sm font-semibold leading-tight">{e.school}</p>
            {(e.degree || e.field) && (
              <p className="text-xs">{[e.degree, e.field].filter(Boolean).join(", ")}</p>
            )}
            {(e.start || e.end) && (
              <p className="text-2xs text-muted-foreground">
                {[e.start, e.end].filter(Boolean).join(" – ")}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  </Card>
) : null}

      </div>

      {/* Right rail */}
      <aside className="sticky top-24 space-y-4">
        {data.currentCompany ? (
  <Card className="p-4">
    <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
      Current company
    </p>

    <Link
      href={`/startup/${data.currentCompany.handle}`}
      className="mt-3 flex items-center gap-2 rounded-xl border p-2 transition-colors hover:bg-muted"
    >
      <LogoTile
  text={data.currentCompany.logoText}
  className="size-10 bg-gradient-to-br from-purple-600 to-blue-600 text-xs text-white"
/>
      <div>
        <p className="text-sm font-semibold">{data.currentCompany.name}</p>
        <p className="text-2xs text-muted-foreground">Aerospace & Space Technology</p>
      </div>
    </Link>

    <div className="mt-3 space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Founded</span>
        <span className="font-medium">2002</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Valuation</span>
        <span className="font-medium">$180B+</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Employees</span>
        <span className="font-medium">13,000+</span>
      </div>
    </div>

    <Link
      href={`/startup/${data.currentCompany.handle}`}
      className={cn(buttonVariants({ variant: "outline" }), "mt-3 h-8 w-full text-xs")}
    >
      View Company
    </Link>
  </Card>
) : null}

        {data.links?.length ? (
  <Card className="p-4">
    <p className="text-sm font-semibold">Links</p>
    <div className="mt-2 space-y-1">
      {data.links.map((l) => (
        <a
          key={l.href + l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg px-2 py-1 text-xs text-primary transition-colors hover:bg-muted"
        >
          {l.label}
          <ArrowUpRight className="size-3" />
        </a>
      ))}
    </div>
  </Card>
) : null}

       {data.alsoViewed?.length ? (
  <Card className="p-4">
    <p className="text-sm font-semibold">People you may know</p>
    <ul className="mt-3 space-y-2">
      {data.alsoViewed.map((p) => (
        <li key={p.handle} className="flex items-start gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-3xs font-semibold text-muted-foreground">
            {p.avatarText}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{p.name}</p>
            <p className="truncate text-2xs text-muted-foreground">{p.headline}</p>
          </div>
        </li>
      ))}
    </ul>
  </Card>
) : null}
<Card className="p-4">
  <p className="text-sm font-semibold">Achievements</p>

  <ul className="mt-3 space-y-3">
    {[
      {
        icon: Trophy,
        title: "Time Person of the Year 2021",
        bg: "bg-warning/10",
        color: "text-warning",
      },
      {
        icon: Rocket,
        title: "First private company to reach orbit",
        bg: "bg-success/10",
        color: "text-success",
      },
      {
        icon: DollarSign,
        title: "Forbes Real Time Billionaires",
        bg: "bg-info/10",
        color: "text-info",
      },
      {
        icon: Star,
        title: "6 Unicorn Companies Built",
        bg: "bg-primary/10",
        color: "text-primary",
      },
    ].map(({ icon: Icon, title, bg, color }) => (
      <li key={title} className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg",
            bg,
          )}
        >
          <Icon className={cn("size-4", color)} />
        </span>

        <span className="text-xs leading-relaxed">
          {title}
        </span>
      </li>
    ))}
  </ul>
</Card>
{/* Skills */}
{data.skills?.length ? (
  <Card className="p-4">
    <p className="text-sm font-semibold">Skills</p>

    <div className="mt-3 flex flex-wrap gap-2">
      {data.skills.map((s, i) => (
        <Badge
          key={s}
          className={cn(
            "rounded-full border px-2.5 py-1 text-2xs font-medium",
            i % 6 === 0 &&
              "border-primary/20 bg-primary/10 text-primary",
            i % 6 === 1 &&
              "border-info/20 bg-info/10 text-info",
            i % 6 === 2 &&
              "border-success/20 bg-success/10 text-success",
            i % 6 === 3 &&
              "border-orange-500/20 bg-orange-500/10 text-orange-500",
            i % 6 === 4 &&
              "border-pink-500/20 bg-pink-500/10 text-pink-500",
            i % 6 === 5 &&
              "border-muted-foreground/20 bg-muted text-muted-foreground"
          )}
        >
          {s}
        </Badge>
      ))}
    </div>

    {data.skills.length > 8 && (
      <button className="mt-3 text-xs font-medium text-primary hover:underline">
        +{data.skills.length - 8} more
      </button>
    )}
  </Card>
) : null}
      </aside>
    </div>
  );
}
