import { NextResponse } from "next/server";
import crypto from "crypto";
import { tiers } from "@/config/site";
import { TIER_FEATURES } from "@/config/tiers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Verify a Razorpay Checkout payment AND grant the membership server-side.
 *
 * The signature is HMAC-SHA256 of `order_id|payment_id` keyed by the secret —
 * this is what proves the payment is real and was not forged by the client.
 * Only after it verifies do we grant: the tier is read from the order's server
 * `notes` (never the client's word), the payment is recorded idempotently by
 * `razorpay_payment_id`, and the membership + lead credits are written with the
 * service-role client (the user cannot write these themselves — RLS blocks it).
 *
 * Idempotent: a replayed payment_id inserts nothing new and re-grants nothing.
 */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    return NextResponse.json({ error: "payments not configured" }, { status: 500 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  // 1 · Signature check — the trust boundary. Timing-safe.
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 2 · Who is paying — from the session cookie, never the client body.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  // 3 · What they bought — from the order's server-side notes + amount, so a
  //     tampered client can't upgrade a cheaper order to a pricier tier.
  const orderRes = await fetch(
    `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
      },
    },
  );
  if (!orderRes.ok) {
    return NextResponse.json({ error: "order lookup failed" }, { status: 502 });
  }
  const order = (await orderRes.json()) as {
    amount: number;
    notes?: { tier?: string };
  };
  const tier = tiers.find(
    (t) => t.id === order.notes?.tier && t.priceInr > 0,
  );
  if (!tier || order.amount !== tier.priceInr * 100) {
    return NextResponse.json({ error: "order/tier mismatch" }, { status: 400 });
  }

  // 4 · Record the payment idempotently. ignoreDuplicates → a replay inserts
  //     nothing, so the grant below runs exactly once per payment.
  const admin = createAdminClient();
  const { data: inserted, error: payErr } = await admin
    .from("payments")
    .upsert(
      {
        user_id: user.id,
        razorpay_payment_id,
        razorpay_order_id,
        amount_paise: order.amount,
        status: "paid",
        captured: true,
        signature_verified: true,
      },
      { onConflict: "razorpay_payment_id", ignoreDuplicates: true },
    )
    .select("id");
  if (payErr) {
    console.error("[razorpay] payment record failed", payErr);
    return NextResponse.json({ error: "grant failed" }, { status: 500 });
  }

  const isNew = (inserted?.length ?? 0) > 0;
  if (isNew) {
    const now = new Date();
    const end = new Date(now);
    end.setFullYear(end.getFullYear() + 1);

    const { error: memErr } = await admin.from("memberships").upsert(
      {
        user_id: user.id,
        tier: tier.id,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: false,
      },
      { onConflict: "user_id" },
    );
    if (memErr) {
      console.error("[razorpay] membership grant failed", memErr);
      return NextResponse.json({ error: "grant failed" }, { status: 500 });
    }

    // Grant the tier's monthly lead credits (venture 5, circle 15).
    const credits = TIER_FEATURES[tier.id].leadCredits;
    if (credits > 0) {
      const { error: credErr } = await admin.from("credit_ledger").insert({
        user_id: user.id,
        delta: credits,
        reason: "monthly_grant",
      });
      if (credErr) console.error("[razorpay] credit grant failed", credErr);
    }
  }

  return NextResponse.json({ ok: true, tier: tier.id });
}
