import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

const schema = z.object({
  email: z.email().max(254),
  name: z.string().trim().max(100).optional(),
});

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function welcomeHtml(name?: string) {
  const hello = name ? `Hi ${esc(name)},` : "Hi there,";
  return `
    <div style="max-width:560px;margin:0 auto;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#ffffff;">
      <h1 style="font-size:28px;font-weight:700;color:#1f2937;margin:0 0 20px;">Welcome to WeCos.</h1>
      <p style="font-size:16px;line-height:1.7;color:#374151;">${hello}</p>
      <p style="font-size:16px;line-height:1.7;color:#374151;">
        Your founder profile is live. The fastest way to get value out of WeCos is
        to say hello — founders who post in their first week get three times the replies.
      </p>
      <a href="${siteConfig.url}/feed"
         style="display:inline-block;margin:24px 0;background:#7c3aed;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
        Introduce yourself
      </a>
      <p style="font-size:14px;color:#9ca3af;margin-top:32px;">— The WeCos Team</p>
    </div>
  `;
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { email, name } = parsed.data;
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to WeCos",
      html: welcomeHtml(name),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[welcome] send failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
