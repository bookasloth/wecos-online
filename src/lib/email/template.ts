import { siteConfig } from "@/config/site";

/**
 * WeCos email design system. One shared layout carries the brand DNA — warm
 * off-white canvas, white rounded card, editorial serif headline, sans body,
 * purple accent, soft shadow, spacious rhythm — while the header band and
 * footer change per category. Email HTML: table-based, all styles inline,
 * web-safe fonts (Georgia for the editorial serif; system sans for body).
 *
 * Commissioned illustrations can later replace the styled header bands by
 * passing a hosted `heroImage` URL.
 */

const B = {
  bg: "#FAF8F5",
  card: "#FFFFFF",
  ink: "#1F2937",
  body: "#374151",
  muted: "#6B7280",
  faint: "#9CA3AF",
  line: "#ECE9E4",
  primary: "#7C3AED",
  indigo: "#6161DD",
  serif: "Georgia, 'Times New Roman', Times, serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

export type EmailCategory =
  | "auth"
  | "account"
  | "newsletter"
  | "community"
  | "product"
  | "transactional";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Band =
  | { kind: "plain" }
  | { kind: "tint"; bg: string }
  | { kind: "gradient"; from: string; to: string };

const HEADER: Record<EmailCategory, { eyebrow: string; icon: string; band: Band; dark?: boolean }> = {
  auth: { eyebrow: "Security", icon: "🔒", band: { kind: "plain" } },
  account: { eyebrow: "Account", icon: "🔔", band: { kind: "tint", bg: "#F3F0FF" } },
  newsletter: { eyebrow: "The Founder Digest", icon: "✦", band: { kind: "gradient", from: "#2E1065", to: "#4338CA" }, dark: true },
  community: { eyebrow: "Coffee Club", icon: "☕", band: { kind: "tint", bg: "#FBF1E8" } },
  product: { eyebrow: "What's new", icon: "🚀", band: { kind: "gradient", from: "#1E1B4B", to: "#6D28D9" }, dark: true },
  transactional: { eyebrow: "Receipt", icon: "🧾", band: { kind: "plain" } },
};

/** Footer link sets per category (per the brief). */
const FOOTER: Record<EmailCategory, { note: string; links: [string, string][]; unsubscribe?: boolean }> = {
  auth: {
    note: "Didn't request this? You can safely ignore this email — no changes were made.",
    links: [["Help", "/resources"], ["Privacy", "/privacy"], ["Terms", "/terms"]],
  },
  account: {
    note: "This is a security notice about your WeCos account. If this wasn't you, secure your account right away.",
    links: [["Contact", "/resources"], ["Privacy", "/privacy"], ["Terms", "/terms"]],
  },
  newsletter: {
    note: "Curated for founders building in India.",
    links: [["Explore", "/startups"], ["Blog", "/resources/blog"], ["Resources", "/resources"]],
    unsubscribe: true,
  },
  community: {
    note: "See you there. Bring a friend who's building.",
    links: [["Coffee Clubs", "/coffee-clubs"], ["Events", "/resources"], ["Privacy", "/privacy"], ["Terms", "/terms"]],
  },
  product: {
    note: "Built with clarity, shipped often.",
    links: [["What's new", "/resources"], ["Studios", "/studios"], ["Roadmap", "/resources"]],
    unsubscribe: true,
  },
  transactional: {
    note: "Keep this email for your records.",
    links: [["Billing", "/resources"], ["Privacy", "/privacy"], ["Terms", "/terms"]],
  },
};

function headerBlock(category: EmailCategory) {
  const h = HEADER[category];
  const dark = h.dark;
  const eyebrowColor = dark ? "rgba(255,255,255,0.72)" : B.muted;
  let bgStyle = `background:${B.card};`;
  if (h.band.kind === "tint") bgStyle = `background:${h.band.bg};`;
  if (h.band.kind === "gradient") bgStyle = `background:${h.band.from};background-image:linear-gradient(135deg,${h.band.from},${h.band.to});`;

  return `
  <tr>
    <td style="${bgStyle}padding:28px 40px 20px;border-radius:22px 22px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${B.serif};font-size:20px;font-weight:700;color:${dark ? "#FFFFFF" : B.ink};letter-spacing:-0.2px;">
          We<span style="color:${dark ? "#C4B5FD" : B.primary};">Cos</span>
        </td>
        <td align="right" style="font-family:${B.sans};font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${eyebrowColor};">
          ${h.icon}&nbsp;&nbsp;${esc(h.eyebrow)}
        </td>
      </tr></table>
    </td>
  </tr>`;
}

function buttonBlock(cta: { label: string; href: string }) {
  return `
  <tr><td style="padding:8px 40px 4px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="background:${B.primary};background-image:linear-gradient(135deg,${B.primary},${B.indigo});border-radius:10px;">
        <a href="${cta.href}" style="display:inline-block;padding:14px 30px;font-family:${B.sans};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">
          ${esc(cta.label)}
        </a>
      </td>
    </tr></table>
  </td></tr>`;
}

function footerBlock(category: EmailCategory, siteUrl: string) {
  const f = FOOTER[category];
  const links = f.links
    .map(([label, href]) => `<a href="${siteUrl}${href}" style="color:${B.muted};text-decoration:none;">${esc(label)}</a>`)
    .join(`<span style="color:${B.faint};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>`);
  const unsub = f.unsubscribe
    ? `<div style="margin-top:10px;"><a href="${siteUrl}/settings" style="color:${B.faint};text-decoration:underline;">Unsubscribe</a></div>`
    : "";
  return `
  <tr><td style="padding:28px 40px 8px;text-align:center;">
    <p style="margin:0 0 14px;font-family:${B.sans};font-size:13px;line-height:1.6;color:${B.muted};">${esc(f.note)}</p>
    <p style="margin:0;font-family:${B.sans};font-size:13px;">${links}</p>
    ${unsub}
  </td></tr>
  <tr><td style="padding:16px 40px 0;text-align:center;">
    <p style="margin:0;font-family:${B.sans};font-size:11px;line-height:1.6;color:${B.faint};">
      WeCos — ${esc(siteConfig.tagline)}<br/>
      Made by WeCos Technologies Pvt Ltd
    </p>
  </td></tr>`;
}

/**
 * Render a full, client-safe email for a category. `bodyHtml` is inserted after
 * the intro for extra content (receipts, enquiry details, digest items) and
 * must already be safe HTML.
 */
export function renderEmail(opts: {
  category: EmailCategory;
  headline: string;
  preheader?: string;
  intro?: string;
  cta?: { label: string; href: string };
  bodyHtml?: string;
  siteUrl?: string;
}): string {
  const siteUrl = opts.siteUrl ?? siteConfig.url;
  const preheader = opts.preheader ?? "";

  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/></head>
<body style="margin:0;padding:0;background:${B.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.bg};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.card};border-radius:22px;box-shadow:0 8px 30px rgba(31,41,55,0.06);overflow:hidden;">
          ${headerBlock(opts.category)}
          <tr><td style="padding:24px 40px 8px;">
            <h1 style="margin:0;font-family:${B.serif};font-size:30px;line-height:1.2;font-weight:700;color:${B.ink};letter-spacing:-0.4px;">${esc(opts.headline)}</h1>
          </td></tr>
          ${opts.intro ? `<tr><td style="padding:14px 40px 4px;"><p style="margin:0;font-family:${B.sans};font-size:16px;line-height:1.7;color:${B.body};">${opts.intro}</p></td></tr>` : ""}
          ${opts.cta ? buttonBlock(opts.cta) : ""}
          ${opts.bodyHtml ? `<tr><td style="padding:20px 40px 4px;">${opts.bodyHtml}</td></tr>` : ""}
          <tr><td style="padding:28px 40px 4px;"><hr style="border:none;border-top:1px solid ${B.line};margin:0;"/></td></tr>
          ${footerBlock(opts.category, siteUrl)}
          <tr><td style="height:32px;"></td></tr>
        </table>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Shared style tokens, for one-off inline content passed as bodyHtml. */
export const emailTokens = B;
