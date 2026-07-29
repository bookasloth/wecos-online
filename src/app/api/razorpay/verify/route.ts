import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Verify a Razorpay Checkout payment. The signature is HMAC-SHA256 of
 * `order_id|payment_id` keyed by the secret — this is what proves the payment
 * is real and was not forged by the client. Never activate a membership on the
 * client's word alone; it must pass here first.
 *
 * ⚠️ MOCK boundary: this confirms the payment signature, but there is no server
 * session or DB yet, so the client is trusted to then call activateMembership.
 * When the backend lands, the tier flip moves server-side (keyed off the webhook
 * `payment.captured`), and this route stops being the trust boundary.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
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

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
