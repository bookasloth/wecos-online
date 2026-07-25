"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";

/**
 * Studio enquiry — a full-screen, one-question-per-step wizard (Typeform-style).
 * Replaces the old single-email modal: it captures a real, qualified lead
 * (need, budget, timeline, contact) so a studio can actually act on it.
 *
 * Posts to /api/company-enquiry — `companyName` carries the studio/package, and
 * the extra fields ride along for the admin notification.
 */

const BUDGETS = ["Under ₹25k / mo", "₹25k–50k / mo", "₹50k–1L / mo", "₹1L+ / mo", "Not sure yet"];
const TIMELINES = ["Start now", "Within a month", "Just exploring"];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function StudioEnquiry({
  studioName,
  packageName,
  label = "Talk to the studio",
  variant = "default",
  className,
}: {
  studioName: string;
  packageName?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
}) {
  const profile = useAppStore((s) => s.profile);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);

  // Portal target is only available after mount (client).
  useEffect(() => setMounted(true), []);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (closeTimer.current && clearTimeout(closeTimer.current)), []);

  // Lock body scroll while the full-screen wizard is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const subject = packageName ? `${studioName} — ${packageName}` : studioName;

  const start = () => {
    // Seed contact from the signed-in profile so most of it is pre-filled.
    setName(profile?.fullName ?? "");
    setEmail(profile?.email ?? "");
    setStep(0);
    setDone(false);
    setError("");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setStep(0);
    setNeed("");
    setBudget("");
    setTimeline("");
    setPhone("");
    setSending(false);
    setDone(false);
    setError("");
  };

  const submit = async () => {
    setError("");
    if (!name.trim()) return setError("Please add your name.");
    if (!emailOk(email)) return setError("Please enter a valid email.");
    if (phone.replace(/\D/g, "").length < 8) return setError("Please enter a valid phone number.");

    setSending(true);
    try {
      const res = await fetch("/api/company-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          userEmail: email,
          companyName: subject,
          name: name.trim(),
          phone: phone.trim(),
          message: need.trim(),
          budget,
          timeline,
        }),
      });
      if (!res.ok) throw new Error("Enquiry failed");
      setDone(true);
      closeTimer.current = setTimeout(close, 3000);
    } catch (err) {
      console.error("[studio-enquiry] failed", err);
      setError("Couldn't send that. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  const total = 4;

  return (
    <>
      <button
        type="button"
        onClick={start}
        className={cn(buttonVariants({ variant, size: "lg" }), className)}
      >
        {label}
      </button>

      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire with ${studioName}`}
          className="fixed inset-0 z-50 overflow-y-auto bg-background"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-5 right-5 grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          <div className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5 py-16 text-center">
            {done ? (
              <div className="space-y-5">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <PartyPopper className="size-6" />
                </span>
                <h2 className="text-3xl font-semibold tracking-tight">Enquiry sent.</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {studioName} will reach out within one working day. Check your inbox
                  for a confirmation.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium tracking-wide text-primary uppercase">
                  {subject}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Step {step + 1} of {total}
                </p>
                <div className="mx-auto mt-4 h-1 w-full max-w-md overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-[width] duration-300"
                    style={{ width: `${((step + 1) / total) * 100}%` }}
                  />
                </div>

                <div className="mt-10">
                  {step === 0 && (
                    <Step
                      heading="What do you need help with?"
                      sub="A line or two on the work — the more specific, the better the quote."
                    >
                      <Textarea
                        autoFocus
                        rows={4}
                        value={need}
                        onChange={(e) => setNeed(e.target.value)}
                        placeholder="e.g. 2 paid channels + a landing page for a D2C launch next month"
                        className="mx-auto max-w-lg text-base"
                      />
                      <NextButton disabled={need.trim().length < 3} onClick={() => setStep(1)} />
                    </Step>
                  )}

                  {step === 1 && (
                    <Step heading="What's your budget?" sub="Ballpark is fine — it helps us scope the right package.">
                      <Options
                        options={BUDGETS}
                        value={budget}
                        onSelect={(v) => {
                          setBudget(v);
                          setStep(2);
                        }}
                      />
                    </Step>
                  )}

                  {step === 2 && (
                    <Step heading="When do you want to start?">
                      <Options
                        options={TIMELINES}
                        value={timeline}
                        onSelect={(v) => {
                          setTimeline(v);
                          setStep(3);
                        }}
                      />
                    </Step>
                  )}

                  {step === 3 && (
                    <Step heading="Where should we send the quote?" sub="We'll reply within one working day. No spam.">
                      <div className="mx-auto max-w-lg space-y-3 text-left">
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" type="email" autoComplete="email" />
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp" type="tel" autoComplete="tel" />
                      </div>
                      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
                      <button
                        type="button"
                        onClick={submit}
                        disabled={sending}
                        className={cn(buttonVariants({ size: "lg" }), "mx-auto mt-6 min-w-48")}
                      >
                        {sending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send enquiry
                            <Check className="size-4" />
                          </>
                        )}
                      </button>
                    </Step>
                  )}
                </div>

                {step > 0 && !done ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="mx-auto mt-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function Step({
  heading,
  sub,
  children,
}: {
  heading: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{heading}</h2>
        {sub ? <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">{sub}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Options({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onSelect(o)}
          className={cn(
            "w-full rounded-xl border px-5 py-4 text-base transition-colors",
            value === o
              ? "border-primary bg-accent/60 text-foreground"
              : "border-border bg-card text-foreground hover:border-primary/50",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function NextButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ size: "lg" }), "mx-auto mt-6 min-w-40")}
    >
      Next
      <ArrowRight className="size-4" />
    </button>
  );
}
