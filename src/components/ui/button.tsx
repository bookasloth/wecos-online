import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button.
 *
 * Three things make this read as considered rather than default:
 *
 * 1. **Real size.** The old scale topped out at 36px tall with 10px of side
 *    padding, so every call site overrode it with `h-11 px-6`. When every use
 *    fights the default, the default is wrong. `lg` is now 48px / 28px padding,
 *    which is where the reference sites sit.
 * 2. **Hover darkens, it doesn't fade.** `bg-primary/80` blends the button into
 *    the page — washed out, not interactive. Mixing toward black keeps it
 *    saturated.
 * 3. **Glare, not lift.** A band of the *original* colour sweeps across and
 *    back, once per hover (`.btn-sheen` in globals.css). Because the band is the
 *    undarkened brand colour rather than white, it reads as light catching a
 *    surface instead of a gloss overlay. Nothing moves position — the button
 *    stays put and the light travels.
 *
 * `prefers-reduced-motion` is handled globally in globals.css.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-[background-color,box-shadow,transform,border-color] duration-200 ease-out focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "btn-sheen [--sheen:var(--primary)] bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-[color-mix(in_oklch,var(--primary),black_12%)]",
        outline:
          "btn-sheen [--sheen:var(--muted)] border-border bg-background hover:border-primary/40 hover:bg-[color-mix(in_oklch,var(--background),var(--foreground)_5%)] aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "btn-sheen [--sheen:var(--secondary)] bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] aria-expanded:bg-secondary",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "btn-sheen [--sheen:var(--destructive)] bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * Heights follow a real rhythm: 28 / 32 / 40 / 48 / 56. Horizontal padding
       * grows faster than height — wide buttons read as more deliberate than
       * tall ones, which is the single biggest difference from the old scale.
       */
      size: {
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-10 gap-2 px-5 text-sm",
        lg: "h-12 gap-2 px-7 text-[0.9375rem] tracking-[0.01em]",
        xl: "h-14 gap-2.5 px-9 text-base tracking-[0.01em]",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
