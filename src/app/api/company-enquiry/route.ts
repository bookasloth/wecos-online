import { NextResponse } from "next/server";
import { z } from "zod";
import { enquiryDocuments, siteConfig } from "@/config/site";
import { sendEmail, renderEmail, emailTokens } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

const STUDIO_CATEGORIES = [
  "marketing",
  "hr",
  "finance",
  "legal",
  "capital-circle",
  "technology",
] as const;
const BUDGET_CODES = ["under_25k", "25k_50k", "50k_1l", "1l_plus", "not_sure"] as const;
const TIMELINE_CODES = ["now", "within_month", "exploring"] as const;

const leadsEnabled = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Escapes a value before it is interpolated into email HTML.
 *
 * Every field below originates from an unauthenticated POST body, so anything
 * that reaches a template must go through here. Without it, a crafted
 * `companyName` can close the surrounding tag and inject arbitrary markup into
 * the inbox of whoever receives the mail.
 */
const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const documentLabels = enquiryDocuments.map((d) => d.label) as [
  string,
  ...string[],
];

/**
 * NOTE: `documentLink` is deliberately absent from this schema. It used to be
 * read from the request body, which let any caller send a WeCos-branded email,
 * from the WeCos SMTP account, to an arbitrary address, containing an arbitrary
 * link. The download URL is now derived server-side from the document enum.
 */
const enquirySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("enquiry"),
    userEmail: z.email().max(254),
    companyName: z.string().trim().min(1).max(200),
    name: z.string().trim().max(100).optional(),
    phone: z.string().trim().max(30).optional(),
    message: z.string().trim().max(2000).optional(),
    budget: z.string().trim().max(60).optional(),
    timeline: z.string().trim().max(60).optional(),
    // Lead routing (all optional — email still works without them):
    companySlug: z.string().trim().max(80).optional(),
    category: z.enum(STUDIO_CATEGORIES).optional(),
    packageName: z.string().trim().max(120).optional(),
    city: z.string().trim().max(80).optional(),
    budgetCode: z.enum(BUDGET_CODES).optional(),
    timelineCode: z.enum(TIMELINE_CODES).optional(),
  }),
  z.object({
    type: z.literal("document"),
    userEmail: z.email().max(254),
    companyName: z.string().trim().min(1).max(200),
    documentName: z.enum(documentLabels),
  }),
]);

/**
 * Per-IP throttle. In-memory, so it resets on deploy and is per-instance — it
 * blunts casual abuse of an endpoint that sends two emails per request through
 * an authenticated Gmail account. Not a substitute for a real edge rate limiter.
 *
 * ponytail: Map + fixed window, swap for an edge/Redis limiter if the site ever
 * runs more than one instance and the abuse is real rather than theoretical.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function adminEmailHtml(input: {
  heading: string;
  companyName: string;
  userEmail: string;
  type: string;
  documentName: string;
  name?: string;
  phone?: string;
  message?: string;
  budget?: string;
  timeline?: string;
}) {
  const row = (label: string, value?: string) =>
    value && value.trim()
      ? `<tr><td style="padding:7px 0;vertical-align:top;font-family:${emailTokens.sans};font-size:14px;font-weight:600;color:${emailTokens.ink};width:160px;">${label}</td><td style="padding:7px 0;font-family:${emailTokens.sans};font-size:14px;line-height:1.6;color:${emailTokens.body};">${esc(value)}</td></tr>`
      : "";
  return renderEmail({
    category: "account",
    preheader: `${input.heading} — ${input.companyName}`,
    headline: input.heading,
    intro: "A new request just came in through WeCos.",
    bodyHtml: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${emailTokens.line};border-radius:12px;padding:6px 18px;">
      ${row("Enquiring about", input.companyName)}
      ${row("Name", input.name)}
      ${row("Email", input.userEmail)}
      ${row("Phone / WhatsApp", input.phone)}
      ${row("What they need", input.message)}
      ${row("Budget", input.budget)}
      ${row("Timeline", input.timeline)}
      ${input.documentName !== "N/A" ? row("Document", input.documentName) : ""}
    </table>`,
  });
}

function documentEmailHtml(input: {
  doc: (typeof enquiryDocuments)[number];
  companyName: string;
  downloadUrl: string;
}) {
  return renderEmail({
    category: "transactional",
    preheader: input.doc.description,
    headline: input.doc.title,
    intro: input.doc.description,
    cta: { label: input.doc.button, href: input.downloadUrl },
    bodyHtml: `<p style="margin:0;font-family:${emailTokens.sans};font-size:13px;color:${emailTokens.faint};">Requested by ${esc(input.companyName)} &middot; ${esc(input.doc.label)}</p>`,
  });
}

function enquiryEmailHtml(input: { companyName: string }) {
  return renderEmail({
    category: "transactional",
    preheader: "We received your enquiry.",
    headline: "Thanks for your enquiry.",
    intro: `Thanks for showing interest in <strong>${esc(input.companyName)}</strong>. Your enquiry is in — our team will review it and get back to you shortly.`,
    cta: { label: "Visit WeCos", href: siteConfig.url },
  });
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  const parsed = enquirySchema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const doc =
    data.type === "document"
      ? enquiryDocuments.find((d) => d.label === data.documentName)
      : undefined;
  const enq = data.type === "enquiry" ? data : undefined;

  try {
    // Admin notification (reply goes straight to the enquirer).
    const adminTo = process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL;
    if (adminTo) {
      await sendEmail({
        to: adminTo,
        replyTo: data.userEmail,
        subject: doc ? `Document Requested: ${doc.label}` : "New Enquiry",
        html: adminEmailHtml({
          heading: doc ? "New Document Request" : "New Company Enquiry",
          companyName: data.companyName,
          userEmail: data.userEmail,
          type: data.type,
          documentName: doc?.label ?? "N/A",
          name: enq?.name,
          phone: enq?.phone,
          message: enq?.message,
          budget: enq?.budget,
          timeline: enq?.timeline,
        }),
      });
    }

    // Confirmation to the enquirer.
    await sendEmail({
      to: data.userEmail,
      subject: doc ? doc.subject : "We received your enquiry",
      html: doc
        ? documentEmailHtml({
            doc,
            companyName: data.companyName,
            downloadUrl: `${siteConfig.url}${doc.path}`,
          })
        : enquiryEmailHtml({ companyName: data.companyName }),
    });

    // Route the enquiry into the leads table so providers in the category see it
    // (masked, via lead_previews). Best-effort: a failure here must not fail the
    // enquiry — the email already went out. Category is resolved server-side from
    // the target startup when a slug is given, so the client can't spoof it.
    if (enq && leadsEnabled()) {
      try {
        const admin = createAdminClient();
        let category: string | null = enq.category ?? null;
        let targetStartupId: string | null = null;
        if (enq.companySlug) {
          const { data: s } = await admin
            .from("startups")
            .select("id,service_category,offers_services")
            .eq("slug", enq.companySlug)
            .maybeSingle();
          if (s?.offers_services && s.service_category) {
            targetStartupId = s.id;
            category = s.service_category;
          }
        }
        if (category) {
          await admin.from("leads").insert({
            target_startup_id: targetStartupId,
            category,
            target_package: enq.packageName ?? null,
            city: enq.city ?? null,
            buyer_name: enq.name ?? null,
            buyer_email: enq.userEmail,
            buyer_phone: enq.phone ?? null,
            message: enq.message ?? null,
            budget: enq.budgetCode ?? null,
            timeline: enq.timelineCode ?? null,
            source: "enquiry",
          });
        }
      } catch (leadErr) {
        console.error("[company-enquiry] lead routing failed", leadErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[company-enquiry] send failed", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
