import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { signUpSchema } from "@/features/auth/schema";

/**
 * Server sign-up. Creates the user with the service-role admin API and
 * `email_confirm: true` — the account is confirmed immediately, so **no
 * confirmation email is sent**. This sidesteps Supabase's built-in email sender
 * (and its low rate limit, which was hard-blocking sign-up), and matches the
 * "no email plumbing until we go online" decision.
 *
 * The client then calls signInWithPassword to get a session. When real email
 * confirmation is wanted (go-live), swap this for supabase.auth.signUp with a
 * configured SMTP sender.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }
  const { fullName, email, password } = parsed.data;

  const { error } = await createAdminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    const already = /already|registered|exist/i.test(error.message);
    return NextResponse.json(
      { error: already ? "already registered" : error.message },
      { status: already ? 409 : 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
