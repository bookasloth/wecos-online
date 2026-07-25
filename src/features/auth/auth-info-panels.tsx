import { KeyRound, MailCheck, LockKeyhole, ShieldCheck, Sparkles, Fingerprint } from "lucide-react";
import { AuthAside } from "./auth-aside";

function Row({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof MailCheck;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{body}</span>
      </span>
    </li>
  );
}

/** forgot-password panel — reassures and shows the three-step recovery flow. */
export function RecoveryPanel() {
  return (
    <AuthAside>
      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
        <LockKeyhole className="size-5" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        Locked out? Happens to the best founders.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        No password, no problem. Getting back in takes about a minute.
      </p>

      <ol className="mt-8 space-y-5">
        <Row icon={MailCheck} title="Tell us your email" body="The one you signed up with." />
        <Row icon={KeyRound} title="Check your inbox" body="We send a secure, single-use reset link." />
        <Row icon={Sparkles} title="Set a new password" body="Choose a fresh one and you're back in." />
      </ol>
    </AuthAside>
  );
}

/** reset-password panel — a few tips for choosing a strong new password. */
export function PasswordTipsPanel() {
  return (
    <AuthAside>
      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
        <ShieldCheck className="size-5" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        One strong password, and you&apos;re back in.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        A good password is long and yours alone. Quick guardrails:
      </p>

      <ol className="mt-8 space-y-5">
        <Row
          icon={Fingerprint}
          title="Make it a passphrase"
          body="Four random words beat one clever word."
        />
        <Row
          icon={ShieldCheck}
          title="Keep it unique"
          body="Don't reuse the password from another site."
        />
        <Row
          icon={KeyRound}
          title="Longer wins"
          body="Length matters more than symbols and numbers."
        />
      </ol>
    </AuthAside>
  );
}
