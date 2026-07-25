import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { memberDiscountPct, entryTier } from "@/config/site";
import { StudiosDirectory } from "@/features/studios/studios-directory";

export const metadata: Metadata = {
  title: "Studios",
  description:
    "WeCos Studios — a directory of vetted studios and service providers founders can hire: marketing, HR, finance, legal, capital and technology.",
  alternates: { canonical: "/studios" },
};

export default function StudiosPage() {
  return (
    <>
      <Container className="py-14 sm:py-20">
        <p className="text-2xs font-medium tracking-[1px] text-primary uppercase">
          WeCos Studios
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-normal tracking-tight text-balance sm:text-5xl">
          The team you&apos;d hire, without the hiring.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A directory of vetted studios and service providers — WeCos&apos;s own
          teams and member businesses — that work with founders. Fixed scope,
          fixed price, and{" "}
          <span className="font-medium text-foreground">
            up to {memberDiscountPct}% off
          </span>{" "}
          for members.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/membership"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            List your business
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/membership"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Membership from {formatInr(entryTier.priceInr)}/year
          </Link>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <StudiosDirectory />
      </Container>

      <div className="border-t border-border">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="text-3xl font-normal tracking-tight text-balance">
            Run a studio? Get in front of founders who need you.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            List your business on WeCos with the Studios Plan and receive enquiries
            from founders actively looking to hire.
          </p>
          <Link
            href="/dashboard/membership"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8")}
          >
            List your business
          </Link>
        </Container>
      </div>
    </>
  );
}
