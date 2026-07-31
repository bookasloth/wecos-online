"use client";

import { useForm, useFieldArray } from "react-hook-form";
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

// Only the fields the public startup page actually renders — collecting more
// would silently drop on save and mislead the founder.
type PersonRow = { name: string; role: string; image: string };
type ProductRow = { name: string; description: string };

type ContentValues = {
  people: PersonRow[];
  products: ProductRow[];
  funding: { totalRaised: string; valuation: string; lastRound: string; investors: string };
};

const emptyPerson: PersonRow = { name: "", role: "", image: "" };
const emptyProduct: ProductRow = { name: "", description: "" };

function toDefaults(startup: Startup | null): ContentValues {
  const d = startup?.details;
  return {
    people: (d?.people ?? []).map((p) => ({
      name: p.name,
      role: p.role,
      image: p.image ?? "",
    })),
    products: (d?.products ?? []).map((p) => ({
      name: p.name,
      description: p.description ?? "",
    })),
    funding: {
      totalRaised: d?.funding?.totalRaised ?? "",
      valuation: d?.funding?.valuation ?? "",
      lastRound: d?.funding?.lastRound ?? "",
      investors: (d?.funding?.investors ?? []).join(", "),
    },
  };
}

/** Trim to keep a non-empty string, else undefined (so empty keys drop out). */
const clean = (v: string) => {
  const t = v.trim();
  return t === "" ? undefined : t;
};

export function StartupContentForm({ onSaved }: { onSaved?: () => void }) {
  const startup = useAppStore((s) => s.startup);
  const saveStartupDetails = useAppStore((s) => s.saveStartupDetails);

  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ContentValues>({ defaultValues: toDefaults(startup) });

  const people = useFieldArray({ control, name: "people" });
  const products = useFieldArray({ control, name: "products" });

  const onSubmit = async (values: ContentValues) => {
    // Only rows with a name are real; the rest are blank leftovers.
    const peopleOut = values.people
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        role: p.role.trim() || "Team",
        avatarText: initials(p.name),
        image: clean(p.image),
      }));

    const productsOut = values.products
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        description: clean(p.description),
      }));

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

    const details = {
      people: peopleOut,
      products: productsOut,
      funding: hasFunding ? funding : undefined,
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
      {/* Team */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Team</h2>
          <p className="text-sm text-muted-foreground">
            The people behind your startup. Shown in “Our Team”.
          </p>
        </div>
        {people.fields.map((f, i) => (
          <div key={f.id} className="space-y-3 rounded-xl border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" htmlFor={`people.${i}.name`} required>
                <Input id={`people.${i}.name`} placeholder="Asha Rao" {...register(`people.${i}.name`)} />
              </Field>
              <Field label="Role" htmlFor={`people.${i}.role`}>
                <Input id={`people.${i}.role`} placeholder="Co-founder & CTO" {...register(`people.${i}.role`)} />
              </Field>
            </div>
            <Field label="Photo URL" htmlFor={`people.${i}.image`} hint="Optional square headshot">
              <Input id={`people.${i}.image`} placeholder="https://…" {...register(`people.${i}.image`)} />
            </Field>
            <Button type="button" variant="ghost" size="sm" onClick={() => people.remove(i)}>
              <Trash2 className="size-4" /> Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => people.append(emptyPerson)}>
          <Plus className="size-4" /> Add team member
        </Button>
      </section>

      {/* Services / Products */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Services &amp; products</h2>
          <p className="text-sm text-muted-foreground">What you offer. Shown in “Our Services”.</p>
        </div>
        {products.fields.map((f, i) => (
          <div key={f.id} className="space-y-3 rounded-xl border border-border p-4">
            <Field label="Name" htmlFor={`products.${i}.name`} required>
              <Input id={`products.${i}.name`} placeholder="Brand strategy sprint" {...register(`products.${i}.name`)} />
            </Field>
            <Field label="Description" htmlFor={`products.${i}.description`}>
              <Textarea id={`products.${i}.description`} rows={2} placeholder="What it is and who it’s for." {...register(`products.${i}.description`)} />
            </Field>
            <Button type="button" variant="ghost" size="sm" onClick={() => products.remove(i)}>
              <Trash2 className="size-4" /> Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => products.append(emptyProduct)}>
          <Plus className="size-4" /> Add service
        </Button>
      </section>

      {/* Funding */}
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

      <Button type="submit" disabled={isSubmitting} className="h-10">
        Save content
      </Button>
    </form>
  );
}
