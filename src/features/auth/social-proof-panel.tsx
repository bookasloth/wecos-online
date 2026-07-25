import { cn } from "@/lib/utils";
import { AuthAside } from "./auth-aside";

/**
 * Sign-up / sign-in right panel: a wall of trusted-brand logos.
 *
 * Logos come from Simple Icons' CDN (single-colour brand marks that invert
 * cleanly to white). Only slugs verified to exist on the CDN are listed, so no
 * tile ever renders a broken image. Hovering a tile greys the rest and turns
 * the hovered one purple with a white logo.
 */

const trustLogos = [
  { name: "Zerodha", slug: "zerodha" },
  { name: "Razorpay", slug: "razorpay" },
  { name: "PhonePe", slug: "phonepe" },
  { name: "Paytm", slug: "paytm" },
  { name: "Swiggy", slug: "swiggy" },
  { name: "Zomato", slug: "zomato" },
  { name: "Postman", slug: "postman" },
  { name: "Zoho", slug: "zoho" },
  { name: "Hasura", slug: "hasura" },
  { name: "Unacademy", slug: "unacademy" },
  { name: "BigBasket", slug: "bigbasket" },
  { name: "OYO", slug: "oyo" },
];

export function SocialProofPanel({ headline }: { headline: string }) {
  return (
    <AuthAside>
      <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
        {headline}
      </p>

      {/* group/wall: hovering any tile greys + dims the rest; the hovered
          tile alone turns purple with a white logo. */}
      <div className="group/wall grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card/60">
        {trustLogos.map((brand, i) => (
          <div key={brand.slug} className={cellClass(i, trustLogos.length)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${brand.slug}`}
              alt={brand.name}
              loading="lazy"
              className="h-7 w-auto max-w-[72%] object-contain transition duration-200 group-hover/wall:grayscale group-hover/tile:brightness-0 group-hover/tile:invert"
            />
          </div>
        ))}
      </div>
    </AuthAside>
  );
}

/** Grid cell with hairline borders that don't double up on the outer edges. */
function cellClass(i: number, total: number) {
  const cols = 3;
  const lastRowStart = Math.floor((total - 1) / cols) * cols;
  const notLastCol = (i + 1) % cols !== 0;
  const notLastRow = i < lastRowStart;
  return cn(
    "group/tile grid h-20 place-items-center px-2 transition-all duration-200",
    "group-hover/wall:opacity-40 hover:!opacity-100 hover:bg-primary",
    notLastCol && "border-r border-border",
    notLastRow && "border-b border-border",
  );
}
