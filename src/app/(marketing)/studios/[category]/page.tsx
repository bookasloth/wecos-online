import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/patterns/breadcrumb";
import {
  accent,
  categories,
  categoryBySlug,
  listingsByCategory,
} from "@/features/studios/catalog";
import { ListingCard } from "@/features/studios/listing-card";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) return { title: "Studios" };
  return {
    title: `${cat.label} studios`,
    description: `${cat.label} studios and providers on WeCos — ${cat.blurb}`,
    alternates: { canonical: `/studios/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categoryBySlug(category);
  if (!cat) notFound();

  const a = accent[cat.accent];
  const Icon = cat.icon;
  const items = listingsByCategory(cat.slug);
  const others = categories.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <Container className="py-12 sm:py-16">
        <Breadcrumb
          items={[{ label: "Studios", href: "/studios" }, { label: cat.label }]}
        />

        <div className="mt-6 flex items-center gap-4">
          <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", a.bg, a.text)}>
            <Icon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">{cat.label}</h1>
            <p className="mt-1 text-muted-foreground">{cat.blurb}</p>
          </div>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Run a {cat.label.toLowerCase()} business?{" "}
          <Link href="/dashboard/membership" className="font-medium text-primary hover:underline">
            List it on WeCos
          </Link>{" "}
          and reach founders looking to hire.
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-14">
          <h2 className="text-2xs font-medium tracking-[1px] text-muted-foreground uppercase">
            Other categories
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((c) => {
              const oa = accent[c.accent];
              const OIcon = c.icon;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/studios/${c.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                  >
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", oa.bg, oa.text)}>
                      <OIcon className="size-4" />
                    </span>
                    <span className="text-sm font-medium">{c.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>

      <div className="border-t border-border">
        <Container className="py-14 text-center">
          <Link
            href="/studios"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Browse all studios
            <ArrowRight className="size-4" />
          </Link>
        </Container>
      </div>
    </>
  );
}
