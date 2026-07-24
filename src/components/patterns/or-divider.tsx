import { cn } from "@/lib/utils";

/** Hairline rule with a centred label. Used between primary and social auth. */
export function OrDivider({
  label = "or",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-2xs font-medium tracking-[1px] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
