import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, renderEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

const schema = z.object({
  email: z.email().max(254),
  name: z.string().trim().max(100).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { email, name } = parsed.data;
  const hello = name ? `Hi ${name},` : "Hi there,";

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to WeCos",
      html: renderEmail({
        category: "account",
        preheader: "Your WeCos founder profile is live.",
        headline: "Welcome to WeCos.",
        intro: `${hello} Your founder profile is live. The fastest way to get value out of WeCos is to say hello — founders who post in their first week get three times the replies.`,
        cta: { label: "Introduce yourself", href: `${siteConfig.url}/feed` },
      }),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[welcome] send failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
