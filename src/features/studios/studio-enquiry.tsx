"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

/**
 * Lead capture for a studio engagement. The only interactive part of an
 * otherwise static studio landing page, so it stays a small client island.
 *
 * Posts to the same /api/company-enquiry route the startup directory uses —
 * `companyName` carries the studio (and package) being asked about.
 */
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
  variant?: "default" | "outline";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const subject = packageName ? `${studioName} — ${packageName}` : studioName;

  const close = () => {
    setOpen(false);
    setEmail("");
    setError("");
    setSuccess("");
  };

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/company-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          userEmail: email,
          companyName: subject,
        }),
      });
      if (!res.ok) throw new Error("Enquiry failed");

      setSuccess("Thanks — the studio will be in touch within one working day.");
      closeTimer.current = setTimeout(close, 2500);
    } catch (err) {
      console.error("[studio-enquiry] failed", err);
      setError("Couldn't send that. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant, size: "lg" }), className)}
      >
        {label}
      </button>

      {open && (
        <Modal
          title={`Talk to ${studioName}`}
          onClose={close}
          titleAction={
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="text-2xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          }
        >
          <p className="mt-2 text-sm text-muted-foreground">
            {packageName ? (
              <>
                Enquiring about{" "}
                <span className="font-medium text-foreground">{packageName}</span>. Leave
                your email and we&apos;ll send scope, timeline and a quote.
              </>
            ) : (
              <>Leave your email and we&apos;ll send scope, timeline and a quote.</>
            )}
          </p>

          <label htmlFor="studio-enquiry-email" className="sr-only">
            Email address
          </label>
          <input
            id="studio-enquiry-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-5 w-full rounded-[4px] border border-border bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          />

          {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
          {success && <p className="mt-2 text-sm font-medium text-success">{success}</p>}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={close}
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className={cn(buttonVariants({ variant: "default" }), "flex-1")}
            >
              {sending ? "Sending…" : "Send enquiry"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
