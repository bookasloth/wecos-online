import "server-only";

/**
 * Transactional email via Resend (plain fetch — no SDK dependency).
 * Server-only. Reads RESEND_API_KEY + RESEND_FROM_EMAIL. If the key is absent
 * it no-ops (logs a warning) so local dev without email keeps working.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY missing — skipping send:", subject);
    return { skipped: true as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from ?? process.env.RESEND_FROM_EMAIL ?? "WeCos <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
