"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/form/field";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { StepRail } from "@/components/patterns/step-rail";
import { cities, studios, siteConfig } from "@/config/site";
import { StartupForm } from "@/features/startups/startup-form";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import { onboardingSteps, stages } from "./steps";
import { HandleField, checkHandle, type HandleState } from "./handle-field";

/** Selectable chip. Used for city, needs and stage. */
function Choice({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
        selected
          ? "border-primary bg-accent/60 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

/**
 * Gate on hydration so the inner form can seed its initial state directly from
 * the persisted profile. Without this the store is empty on first render and the
 * fields would need an effect to backfill — which is both a cascading render and
 * a visible flash of empty inputs.
 */
export function OnboardingFlow() {
  const hydrated = useAppHydrated();

  if (!hydrated) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Flow />;
}

function Flow() {
  const profile = useAppStore((s) => s.profile);
  const session = useAppStore((s) => s.session);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const setHandle = useAppStore((s) => s.setHandle);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Step 1 — seeded from whatever sign-up already captured.
  const [fullName, setFullName] = useState(() => profile?.fullName ?? "");
  const [headline, setHeadline] = useState(() => profile?.headline ?? "");
  const [citySlug, setCitySlug] = useState(() => profile?.citySlug ?? "");
  const [handle, setHandleValue] = useState(() => profile?.handle ?? "");

  // Step 2
  const [needs, setNeeds] = useState<string[]>([]);
  const [stage, setStage] = useState("");

  // Derived, not stored — validation is a pure function of the input.
  // ⚠️ MOCK: synchronous. The `checking` state exists so this can become a
  // debounced server lookup later without the UI changing.
  const handleState: HandleState = useMemo(() => checkHandle(handle), [handle]);

  const step1Valid = fullName.trim().length >= 2 && handleState.status === "ok";
  const stepsDone = useMemo(() => (done ? onboardingSteps.length : step), [done, step]);

  const finish = () => {
    completeOnboarding();
    setDone(true);
  };

  const saveStep1 = () => {
    saveProfile({
      fullName: fullName.trim(),
      headline: headline.trim(),
      citySlug,
      location: cities.find((c) => c.slug === citySlug)?.name ?? "",
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
    if (handle && handle !== profile?.handle) setHandle(handle);
    setStep(1);
  };

  const saveStep2 = () => {
    saveProfile({
      fullName: fullName.trim() || profile?.fullName || "",
      headline: headline.trim(),
      citySlug,
      needs,
      stage,
      location: cities.find((c) => c.slug === citySlug)?.name ?? "",
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
    setStep(2);
  };

  /* ------------------------------ completion ------------------------------ */

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <PartyPopper className="size-6" />
        </span>

        <div className="mt-6">
          <TwoToneHeading lead="You're" strong="in." className="text-center" />
        </div>

        <p className="mt-4 leading-relaxed text-muted-foreground">
          Your profile is live at{" "}
          <span className="font-medium text-foreground">
            {siteConfig.url.replace(/^https?:\/\//, "")}/{profile?.handle}
          </span>
          . The fastest way to get value out of WeCos is to say hello — founders
          who post in their first week get three times the replies.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/feed" className={cn(buttonVariants({ variant: "default", size: "lg" }))}>
            Introduce yourself
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------------------- steps -------------------------------- */

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
      <StepRail steps={onboardingSteps} current={stepsDone} className="lg:sticky lg:top-10 lg:self-start" />

      <div className="min-w-0 max-w-xl">
        {step === 0 && (
          <section className="space-y-7">
            <div className="space-y-2">
              <TwoToneHeading lead="First," strong="who are you?" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is what other founders see. You can change all of it later —
                except your link.
              </p>
            </div>

            <div className="space-y-5">
              <Field label="Full name" htmlFor="fullName" required>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aman Mehta"
                  autoComplete="name"
                />
              </Field>

              <Field
                label="Headline"
                htmlFor="headline"
                hint="One line. What you're building, or what you do."
              >
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Founder, building in fintech"
                />
              </Field>

              <HandleField value={handle} onChange={setHandleValue} state={handleState} />

              <div className="space-y-2">
                <p className="text-sm font-medium">Your city</p>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll connect you to your Coffee Club chapter.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <Choice
                      key={c.slug}
                      selected={citySlug === c.slug}
                      onClick={() => setCitySlug(citySlug === c.slug ? "" : c.slug)}
                    >
                      {c.name}
                    </Choice>
                  ))}
                  <Choice
                    selected={citySlug === "elsewhere"}
                    onClick={() => setCitySlug(citySlug === "elsewhere" ? "" : "elsewhere")}
                  >
                    Somewhere else
                  </Choice>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-xs text-muted-foreground">Step 1 of 3</p>
              <Button onClick={saveStep1} disabled={!step1Valid} size="lg">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-7">
            <div className="space-y-2">
              <TwoToneHeading lead="What do you" strong="need right now?" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Pick as many as apply. This decides who we introduce you to and
                what we surface first — nothing is shown publicly.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Where you are</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {stages.map((s) => (
                  <Choice
                    key={s.id}
                    selected={stage === s.id}
                    onClick={() => setStage(stage === s.id ? "" : s.id)}
                  >
                    <span className="block font-medium text-foreground">{s.label}</span>
                    <span className="block text-xs">{s.hint}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Help you could use</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {studios.map((s) => {
                  const on = needs.includes(s.slug);
                  return (
                    <Choice
                      key={s.slug}
                      selected={on}
                      onClick={() =>
                        setNeeds(on ? needs.filter((n) => n !== s.slug) : [...needs, s.slug])
                      }
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">{s.name}</span>
                        {on ? <Check className="size-4 shrink-0 text-primary" /> : null}
                      </span>
                      <span className="block text-xs">{s.summary}</span>
                    </Choice>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <Button onClick={saveStep2} size="lg">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-7">
            <div className="space-y-2">
              <TwoToneHeading lead="Last one —" strong="your venture." />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Creating a page now means people can find you. It stays private
                until you list it, and you can do this later instead.
              </p>
            </div>

            <StartupForm
              submitLabel="Create my venture page"
              onSaved={() => {
                toast.success("Venture page created");
                finish();
              }}
            />

            <div className="flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                I&apos;m still exploring — skip
              </button>
            </div>
          </section>
        )}

        {!session ? (
          <p className="mt-8 text-xs text-muted-foreground">
            Not signed in?{" "}
            <Link href="/sign-in" className="underline underline-offset-2">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
