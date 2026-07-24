import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  Globe,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Startup } from "@/features/startups/schema";

/**
 * Presentational startup page — pure, no store. Shared by the owner's dashboard
 * view and the public startup page. Pass `founder` to show a "Founded by" link.
 * Rich sections (founded/team/funding, tags, milestones, looking-for, links)
 * render only when present.
 */
export function StartupDisplay({
  startup,
  founder,
}: {
  startup: Startup;
  founder?: { name: string; handle: string };
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-28 bg-gradient-to-br from-primary/20 to-brand-indigo/10" />
      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-8 flex items-end gap-4">
          {startup.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={startup.logoUrl}
              alt={startup.name}
              className="size-16 rounded-2xl border-4 border-card object-cover"
            />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-primary-foreground">
              {startup.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">{startup.name}</h2>
          {startup.tagline ? (
            <p className="text-muted-foreground">{startup.tagline}</p>
          ) : null}
        </div>

        {(startup.industry || startup.stage) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {startup.industry ? <Badge variant="secondary">{startup.industry}</Badge> : null}
            {startup.stage ? <Badge variant="secondary">{startup.stage}</Badge> : null}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {startup.website ? (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Globe className="size-4" />
              Website
            </a>
          ) : null}
          {startup.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {startup.location}
            </span>
          ) : null}
          {startup.foundedYear ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              Founded {startup.foundedYear}
            </span>
          ) : null}
          {startup.teamSize ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" />
              {startup.teamSize}
            </span>
          ) : null}
          {startup.funding ? (
            <span className="inline-flex items-center gap-1.5">
              <Banknote className="size-4" />
              {startup.funding}
            </span>
          ) : null}
        </div>

        {startup.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {startup.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {startup.description ? (
          <p className="mt-6 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
            {startup.description}
          </p>
        ) : null}

        {startup.milestones?.length ? (
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Milestones
            </p>
            <ul className="mt-3 space-y-3">
              {startup.milestones.map((m, i) => (
                <li key={`${m.date}-${i}`} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{m.text}</p>
                    <p className="text-xs text-muted-foreground">{m.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {startup.lookingFor ? (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-accent/40 p-4">
            <Target className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm">
              <span className="font-medium">Looking for </span>
              <span className="text-muted-foreground">{startup.lookingFor}</span>
            </p>
          </div>
        ) : null}

        {startup.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {startup.links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {l.label}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        ) : null}

        {founder ? (
          <Link
            href={`/${founder.handle}`}
            className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="text-sm">
              <span className="text-muted-foreground">Founded by </span>
              <span className="font-medium text-foreground">{founder.name}</span>
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
