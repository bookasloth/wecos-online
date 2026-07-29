import { NextResponse } from "next/server";
import { tiers, type TierId } from "@/config/site";

/**
 * Create a Razorpay order for a membership tier. Amount is taken from the tier
 * config server-side — never trusted from the client, or a caller could pay ₹1
 * for a Circle membership.
 *
 * Returns the order id + the publishable key_id (safe to expose) so the browser
 * can open Checkout. The key_secret never leaves the server.
 */
export async function POST(req: Request) {
  let body: { tier?: TierId };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const tier = tiers.find((t) => t.id === body.tier && t.priceInr > 0);
  if (!tier) {
    return NextResponse.json({ error: "invalid tier" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "payments not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: tier.priceInr * 100, // paise
      currency: "INR",
      receipt: `tier_${tier.id}_${Date.now()}`,
      notes: { tier: tier.id },
    }),
  });

  if (!res.ok) {
    console.error("[razorpay] order create failed", res.status, await res.text());
    return NextResponse.json({ error: "order failed" }, { status: 502 });
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  });
}
