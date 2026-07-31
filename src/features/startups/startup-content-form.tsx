"use client";

import {
  useForm,
  useFieldArray,
  type Control,
  type UseFormRegister,
  type Path,
  type FieldArrayPath,
} from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Startup } from "@/features/startups/schema";
import { useAppStore } from "@/lib/store/app-store";
import { persistStartupDetails } from "@/features/onboarding/persist";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/** Initials for the avatar fallback, e.g. "Asha Rao" → "AR". */
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

// Form-side row shapes hold only the fields the public page renders — collecting
// more would silently drop on save and mislead the founder. Everything is a
// string in the form; onSubmit coerces (numbers, initials, engagement zeros).
type ContentValues = {
  people: { name: string; role: string; image: string }[];
  products: { name: string; description: string }[];
  updates: { text: string }[];
  jobs: { title: string; location: string; type: string }[];
  stats: { label: string; value: string }[];
  traction: { title: string; points: { label: string; value: string }[] };
  funding: { totalRaised: string; valuation: string; lastRound: string; investors: string };
  reviews: { client: string; company: string; rating: string; review: string; video: string }[];
  documents: { name: string }[];
  socials: { linkedin: string; instagram: string; facebook: string; twitter: string; youtube: string };
  businessType: string;
};

function toDefaults(startup: Startup | null): ContentValues {
  const d = startup?.details;
  return {
    people: (d?.people ?? []).map((p) => ({ name: p.name, role: p.role, image: p.image ?? "" })),
    products: (d?.products ?? []).map((p) => ({ name: p.name, description: p.description ?? "" })),
    updates: (d?.updates ?? []).map((u) => ({ text: u.text })),
    jobs: (d?.jobs ?? []).map((j) => ({ title: j.title, location: j.location, type: j.type })),
    stats: (d?.stats ?? []).map((s) => ({ label: s.label, value: s.value })),
    traction: {
      title: d?.traction?.title ?? "",
      points: (d?.traction?.points ?? []).map((p) => ({ label: p.label, value: String(p.value) })),
    },
    funding: {
      totalRaised: d?.funding?.totalRaised ?? "",
      valuation: d?.funding?.valuation ?? "",
      lastRound: d?.funding?.lastRound ?? "",
      investors: (d?.funding?.investors ?? []).join(", "),
    },
    reviews: (d?.reviews ?? []).map((r) => ({
      client: r.client,
      company: r.company,
      rating: String(r.rating),
      review: r.review,
      video: r.video ?? "",
    })),
    documents: (d?.documents ?? []).map((doc) => ({ name: doc.name })),
    socials: {
      linkedin: d?.socials?.linkedin ?? "",
      instagram: d?.socials?.instagram ?? "",
      facebook: d?.socials?.facebook ?? "",
      twitter: d?.socials?.twitter ?? "",
      youtube: d?.socials?.youtube ?? "",
    },
    businessType: d?.overview?.type ?? "",
  };
}

/** Trim to keep a non-empty string, else undefined (so empty keys drop out). */
const clean = (v: string) => {
  const t = v.trim();
  return t === "" ? undefined : t;
};

type Col = { key: string; label: string; placeholder?: string; hint?: string; textarea?: boolean; required?: boolean; type?: string };

/**
 * Generic repeatable-row editor for a details array (team, services, updates,
 * jobs, stats). Each column is a plain text/textarea field; the parent owns the
 * shape and the save-time mapping.
 */
function RowList({
  control,
  register,
  name,
  heading,
  description,
  addLabel,
  columns,
  empty,
}: {
  control: Control<ContentValues>;
  register: UseFormRegister<ContentValues>;
  name: FieldArrayPath<ContentValues>;
  heading: string;
  description: string;
  addLabel: string;
  columns: Col[];
  empty: Record<string, string>;
}) {
  const fa = useFieldArray({ control, name });
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">{heading}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {fa.fields.map((f, i) => (
        <div key={f.id} className="space-y-3 rounded-xl border border-border p-4">
          {columns.map((c) => {
            const path = `${name}.${i}.${c.key}` as Path<ContentValues>;
            return (
              <Field key={c.key} label={c.label} htmlFor={path} required={c.required} hint={c.hint}>
                {c.textarea ? (
                  <Textarea id={path} rows={2} placeholder={c.placeholder} {...register(path)} />
                ) : (
                  <Input id={path} type={c.type} placeholder={c.placeholder} {...register(path)} />
                )}
              </Field>
            );
          })}
          <Button type="button" variant="ghost" size="sm" onClick={() => fa.remove(i)}>
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => fa.append(empty as never)}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </section>
  );
}

export function StartupContentForm({ onSaved }: { onSaved?: () => void }) {
  const startup = useAppStore((s) => s.startup);
  const saveStartupDetails = useAppStore((s) => s.saveStartupDetails);

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ContentValues>({ defaultValues: toDefaults(startup) });

  const tractionPoints = useFieldArray({ control, name: "traction.points" });

  const onSubmit = async (values: ContentValues) => {
    // Only rows with the anchor field filled are real; drop blank leftovers.
    const people = values.people
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        role: p.role.trim() || "Team",
        avatarText: initials(p.name),
        image: clean(p.image),
      }));

    const products = values.products
      .filter((p) => p.name.trim())
      .map((p) => ({ name: p.name.trim(), description: clean(p.description) }));

    // Founder-authored updates have no engagement yet — the template shows the
    // likes/comments line only when non-zero (see company-page).
    const updates = values.updates
      .filter((u) => u.text.trim())
      .map((u) => ({ text: u.text.trim(), date: "", likes: 0, comments: 0 }));

    const jobs = values.jobs
      .filter((j) => j.title.trim())
      .map((j) => ({ title: j.title.trim(), location: j.location.trim(), type: j.type.trim() }));

    const stats = values.stats
      .filter((s) => s.label.trim() && s.value.trim())
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }));

    const points = values.traction.points
      .filter((p) => p.label.trim() && p.value.trim())
      .map((p) => ({ label: p.label.trim(), value: Number(p.value) || 0 }));
    const traction = points.length
      ? { title: values.traction.title.trim() || "Growth", points }
      : undefined;

    const investors = values.funding.investors
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const funding = {
      totalRaised: clean(values.funding.totalRaised),
      valuation: clean(values.funding.valuation),
      lastRound: clean(values.funding.lastRound),
      investors: investors.length ? investors : undefined,
    };
    const hasFunding = Object.values(funding).some((v) => v != null);

    const reviews = values.reviews
      .filter((r) => r.client.trim() && r.review.trim())
      .map((r) => ({
        client: r.client.trim(),
        company: r.company.trim(),
        rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
        review: r.review.trim(),
        video: clean(r.video),
      }));

    const documents = values.documents
      .filter((d) => d.name.trim())
      .map((d) => ({ name: d.name.trim() }));

    const s = {
      linkedin: clean(values.socials.linkedin),
      instagram: clean(values.socials.instagram),
      facebook: clean(values.socials.facebook),
      twitter: clean(values.socials.twitter),
      youtube: clean(values.socials.youtube),
    };
    const socials = Object.values(s).some(Boolean) ? s : undefined;

    const bt = clean(values.businessType);
    const overview = bt ? { type: bt } : undefined;

    const details = {
      people,
      products,
      updates,
      jobs,
      stats,
      traction,
      funding: hasFunding ? funding : undefined,
      reviews,
      documents,
      socials,
      overview,
    };

    saveStartupDetails(details); // instant local + offline fallback
    try {
      await persistStartupDetails(details);
    } catch (err) {
      toast.error(
        err instanceof Error ? `Couldn’t sync: ${err.message}` : "Couldn’t sync to server",
      );
      return;
    }
    toast.success("Page content saved");
    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <RowList
        control={control}
        register={register}
        name="people"
        heading="Team"
        description="The people behind your startup. Shown in “Our Team”."
        addLabel="Add team member"
        empty={{ name: "", role: "", image: "" }}
        columns={[
          { key: "name", label: "Name", placeholder: "Asha Rao", required: true },
          { key: "role", label: "Role", placeholder: "Co-founder & CTO" },
          { key: "image", label: "Photo URL", placeholder: "https://…", hint: "Optional square headshot" },
        ]}
      />

      <RowList
        control={control}
        register={register}
        name="products"
        heading="Services & products"
        description="What you offer. Shown in “Our Services”."
        addLabel="Add service"
        empty={{ name: "", description: "" }}
        columns={[
          { key: "name", label: "Name", placeholder: "Brand strategy sprint", required: true },
          { key: "description", label: "Description", placeholder: "What it is and who it’s for.", textarea: true },
        ]}
      />

      <RowList
        control={control}
        register={register}
        name="updates"
        heading="Recent updates"
        description="Short posts about progress. Shown in “Recent Updates”."
        addLabel="Add update"
        empty={{ text: "" }}
        columns={[
          { key: "text", label: "Update", placeholder: "Shipped v2, crossed 1,000 users…", textarea: true, required: true },
        ]}
      />

      <RowList
        control={control}
        register={register}
        name="jobs"
        heading="Open roles"
        description="Roles you’re hiring for. Shown in “Open Roles”."
        addLabel="Add role"
        empty={{ title: "", location: "", type: "" }}
        columns={[
          { key: "title", label: "Title", placeholder: "Founding engineer", required: true },
          { key: "location", label: "Location", placeholder: "Pune / Remote" },
          { key: "type", label: "Type", placeholder: "Full-time" },
        ]}
      />

      <RowList
        control={control}
        register={register}
        name="stats"
        heading="Stats"
        description="Headline numbers. Shown as tiles under “Track record”."
        addLabel="Add stat"
        empty={{ label: "", value: "" }}
        columns={[
          { key: "value", label: "Value", placeholder: "12,000", required: true },
          { key: "label", label: "Label", placeholder: "Active users", required: true },
        ]}
      />

      {/* Traction — a titled growth chart with numeric points. */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Traction</h2>
          <p className="text-sm text-muted-foreground">
            A growth chart under “Track record”. Add at least two points; leave empty to hide.
          </p>
        </div>
        <Field label="Chart title" htmlFor="traction.title">
          <Input id="traction.title" placeholder="Monthly revenue" {...register("traction.title")} />
        </Field>
        {tractionPoints.fields.map((f, i) => (
          <div key={f.id} className="flex items-end gap-3 rounded-xl border border-border p-4">
            <Field label="Point" htmlFor={`traction.points.${i}.label`} className="flex-1">
              <Input id={`traction.points.${i}.label`} placeholder="Jan" {...register(`traction.points.${i}.label`)} />
            </Field>
            <Field label="Value" htmlFor={`traction.points.${i}.value`} className="flex-1">
              <Input
                id={`traction.points.${i}.value`}
                type="number"
                placeholder="120"
                {...register(`traction.points.${i}.value`)}
              />
            </Field>
            <Button type="button" variant="ghost" size="sm" onClick={() => tractionPoints.remove(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => tractionPoints.append({ label: "", value: "" })}
        >
          <Plus className="size-4" /> Add point
        </Button>
      </section>

      {/* Business type — shown under Quick Facts. */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Business type</h2>
          <p className="text-sm text-muted-foreground">Shown in “Quick Facts”. Leave blank to hide.</p>
        </div>
        <Field label="Business type" htmlFor="businessType">
          <Input id="businessType" placeholder="Private · B2B SaaS" {...register("businessType")} />
        </Field>
      </section>

      {/* Funding — a flat block, hidden on the page when left blank. */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Funding</h2>
          <p className="text-sm text-muted-foreground">Leave blank to hide the funding block.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Total raised" htmlFor="funding.totalRaised">
            <Input id="funding.totalRaised" placeholder="$2.5M" {...register("funding.totalRaised")} />
          </Field>
          <Field label="Valuation" htmlFor="funding.valuation">
            <Input id="funding.valuation" placeholder="$18M" {...register("funding.valuation")} />
          </Field>
          <Field label="Last round" htmlFor="funding.lastRound">
            <Input id="funding.lastRound" placeholder="Seed" {...register("funding.lastRound")} />
          </Field>
        </div>
        <Field label="Investors" htmlFor="funding.investors" hint="Comma-separated">
          <Input id="funding.investors" placeholder="Accel, Blume, angels" {...register("funding.investors")} />
        </Field>
      </section>

      <RowList
        control={control}
        register={register}
        name="reviews"
        heading="Reviews & testimonials"
        description="Client quotes. Shown in “Reviews & Testimonials”."
        addLabel="Add review"
        empty={{ client: "", company: "", rating: "5", review: "", video: "" }}
        columns={[
          { key: "client", label: "Client name", placeholder: "Sarah Chen", required: true },
          { key: "company", label: "Company", placeholder: "Acme Inc." },
          { key: "rating", label: "Rating (1–5)", placeholder: "5", type: "number" },
          { key: "review", label: "Review", placeholder: "What they said…", textarea: true, required: true },
          { key: "video", label: "Video URL", placeholder: "https://… (optional)", hint: "Plays in a popup" },
        ]}
      />

      <RowList
        control={control}
        register={register}
        name="documents"
        heading="Documents"
        description="Downloadable resources (pitch deck, brochure…). Shown in “Documents”; visitors enquire to access."
        addLabel="Add document"
        empty={{ name: "" }}
        columns={[
          { key: "name", label: "Name", placeholder: "Pitch Deck", required: true },
        ]}
      />

      {/* Social profiles — links in the sidebar; hidden when all blank. */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Social profiles</h2>
          <p className="text-sm text-muted-foreground">Full URLs. Only the ones you fill appear.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="LinkedIn" htmlFor="socials.linkedin">
            <Input id="socials.linkedin" placeholder="https://linkedin.com/company/…" {...register("socials.linkedin")} />
          </Field>
          <Field label="Instagram" htmlFor="socials.instagram">
            <Input id="socials.instagram" placeholder="https://instagram.com/…" {...register("socials.instagram")} />
          </Field>
          <Field label="Facebook" htmlFor="socials.facebook">
            <Input id="socials.facebook" placeholder="https://facebook.com/…" {...register("socials.facebook")} />
          </Field>
          <Field label="X (Twitter)" htmlFor="socials.twitter">
            <Input id="socials.twitter" placeholder="https://x.com/…" {...register("socials.twitter")} />
          </Field>
          <Field label="YouTube" htmlFor="socials.youtube">
            <Input id="socials.youtube" placeholder="https://youtube.com/@…" {...register("socials.youtube")} />
          </Field>
        </div>
      </section>

      <Button type="submit" disabled={isSubmitting} className="h-10">
        Save content
      </Button>
    </form>
  );
}
