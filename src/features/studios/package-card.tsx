import { Check } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { memberDiscountPct, type StudioPackage } from "@/config/site";
import { StudioEnquiry } from "./studio-enquiry";

/** Member price for a package, rounded to the nearest ₹100. */
export const memberPrice = (priceInr: number) =>
  Math.round((priceInr * (100 - memberDiscountPct)) / 100 / 100) * 100;

export function PackageCard({
  pkg,
  studioName,
}: {
  pkg: StudioPackage;
  studioName: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-6",
        pkg.featured ? "border-primary/40" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-medium">{pkg.name}</h3>
        {pkg.featured && (
          <span className="rounded-[4px] bg-primary/10 px-2 py-0.5 text-2xs font-medium tracking-wide text-primary uppercase">
            Most picked
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pkg.summary}</p>

      <div className="mt-6">
        {pkg.priceInr === null ? (
          <p className="text-3xl font-normal tracking-tight">{pkg.priceNote ?? "On request"}</p>
        ) : (
          <>
            <p className="text-3xl font-normal tracking-tight">
              {formatInr(pkg.priceInr)}
              <span className="ml-1.5 text-sm text-muted-foreground">{pkg.cadence}</span>
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <span className="font-medium text-primary">
                {formatInr(memberPrice(pkg.priceInr))}
              </span>{" "}
              for members
            </p>
          </>
        )}
      </div>

      <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>

      <StudioEnquiry
        studioName={studioName}
        packageName={pkg.name}
        label="Enquire"
        variant={pkg.featured ? "default" : "outline"}
        className="mt-6 w-full"
      />
    </div>
  );
}
