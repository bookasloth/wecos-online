import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { enquiryDocuments, siteConfig } from "@/config/site";

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
      ? `<tr><td style="padding:6px 0;vertical-align:top"><b>${label}</b></td><td style="padding:6px 0">${esc(value)}</td></tr>`
      : "";

  return `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);padding:25px;color:white">
            <h1 style="margin:0">
              ${input.heading}
            </h1>
            <p>A new request has been submitted through WeCos.</p>
          </div>

          <div style="padding:30px">
            <table style="width:100%">
              ${row("Enquiring about", input.companyName)}
              ${row("Name", input.name)}
              ${row("User Email", input.userEmail)}
              ${row("Phone / WhatsApp", input.phone)}
              ${row("What they need", input.message)}
              ${row("Budget", input.budget)}
              ${row("Timeline", input.timeline)}
              ${row("Type", input.type)}
              ${input.documentName !== "N/A" ? row("Document", input.documentName) : ""}
              <tr>
                <td style="padding:6px 0"><b>Date</b></td>
                <td style="padding:6px 0">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>
      `;
}

function documentEmailHtml(input: {
  doc: (typeof enquiryDocuments)[number];
  companyName: string;
  downloadUrl: string;
}) {
  return `
            <div style="max-width:600px;margin:0 auto;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#ffffff;">
              <div style="margin-bottom:30px">
                <img src="${siteConfig.url}/logo.png" width="40" alt="WeCos" />
              </div>

              <h1 style="font-size:40px;font-weight:700;color:#1f2937;margin:0 0 25px 0;">
                ${input.doc.title}
              </h1>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                We hope you're having a wonderful day.
              </p>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                ${input.doc.description}
              </p>

              <div style="background:#f8fafc;padding:20px;border-radius:10px;margin:30px 0;">
                <p><b>Company:</b> ${esc(input.companyName)}</p>
                <p><b>Document:</b> ${input.doc.label}</p>
                <p><b>Requested:</b> ${new Date().toLocaleString()}</p>
              </div>

              <a href="${input.downloadUrl}" style="background:#7c3aed;color:#ffffff;padding:16px 32px;border-radius:6px;text-decoration:none;font-size:18px;font-weight:600;display:inline-block;margin-bottom:50px;">
                ${input.doc.button}
              </a>

              <p style="font-size:20px;color:#374151;margin-top:20px;">
                Thanks for your interest!
              </p>

              <p style="font-size:20px;color:#374151;">Cheers,</p>

              <p style="font-size:20px;color:#374151;font-weight:600;">
                The WeCos Team
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:50px 0 30px 0;">

              <p style="text-align:center;color:#9ca3af;font-size:14px;">
                Made by WeCos Technologies Pvt Ltd
              </p>
            </div>
          `;
}

function enquiryEmailHtml(input: { companyName: string }) {
  return `
            <div style="max-width:600px;margin:0 auto;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#ffffff;">
              <div style="margin-bottom:30px">
                <img src="${siteConfig.url}/logo.png" width="40" alt="WeCos" />
              </div>

              <h1 style="font-size:40px;font-weight:700;color:#1f2937;margin:0 0 25px 0;">
                Thank you for your enquiry!
              </h1>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                We hope you're having a wonderful day.
              </p>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                Thank you for showing interest in
                <strong>${esc(input.companyName)}</strong>.
                Your enquiry has been successfully submitted and our team will review it shortly.
              </p>

              <a href="${siteConfig.url}" style="background:#7c3aed;color:#ffffff;padding:16px 32px;border-radius:6px;text-decoration:none;font-size:18px;font-weight:600;display:inline-block;margin-bottom:50px;">
                Visit WeCos
              </a>

              <p style="font-size:20px;color:#374151;margin-top:20px;">
                Thanks for your interest!
              </p>

              <p style="font-size:20px;color:#374151;">Cheers,</p>

              <p style="font-size:20px;color:#374151;font-weight:600;">
                The WeCos Team
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:50px 0 30px 0;">

              <p style="text-align:center;color:#9ca3af;font-size:14px;">
                Made by WeCos Technologies Pvt Ltd
              </p>
            </div>
          `;
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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"WeCos" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
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

    await transporter.sendMail({
      from: `"WeCos" <${process.env.SMTP_EMAIL}>`,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[company-enquiry] send failed", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
