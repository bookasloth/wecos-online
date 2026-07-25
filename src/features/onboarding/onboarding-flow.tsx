"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/form/field";
import { TwoToneHeading } from "@/components/patterns/two-tone-heading";
import { StepRail } from "@/components/patterns/step-rail";
import { cities, studios, siteConfig } from "@/config/site";
import { industries } from "@/features/startups/constants";
import { indianDistricts } from "@/config/india-districts";
import { useAppStore, useAppHydrated } from "@/lib/store/app-store";
import { onboardingSteps, stages } from "./steps";
import { HandleField, checkHandle, type HandleState } from "./handle-field";
import { LivePreview } from "./live-preview";

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

// Step indices — two framing screens bookend the three data steps.
const WELCOME = 0;
const PROFILE = 1;
const FOCUS = 2;
const COMPANY = 3;
const DONE = 4;

function Flow() {
  const profile = useAppStore((s) => s.profile);
  const saveProfile = useAppStore((s) => s.saveProfile);
  const setHandle = useAppStore((s) => s.setHandle);
  const saveStartup = useAppStore((s) => s.saveStartup);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(WELCOME);

  // About you — seeded from whatever sign-up already captured.
  const [fullName, setFullName] = useState(() => profile?.fullName ?? "");
  const [headline, setHeadline] = useState(() => profile?.headline ?? "");
  const [cityValue, setCityValue] = useState(() => {
    const c = cities.find((c) => c.slug === profile?.citySlug);
    return c?.name ?? profile?.location ?? "";
  });
  const [handle, setHandleValue] = useState(() => profile?.handle ?? "");

  // What you need
  const [needs, setNeeds] = useState<string[]>(() => profile?.needs ?? []);
  const [stage, setStage] = useState(() => profile?.stage ?? "");

  // Company — optional, saved via saveStartup on continue.
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyBio, setCompanyBio] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Derived, not stored — validation is a pure function of the input.
  // ⚠️ MOCK: synchronous. The `checking` state exists so this can become a
  // debounced server lookup later without the UI changing.
  const handleState: HandleState = useMemo(() => checkHandle(handle), [handle]);
  const profileValid = fullName.trim().length >= 2 && handleState.status === "ok";
  const companyValid = companyName.trim().length >= 2;

  // Coffee Club cities first, then every other Indian district. Deduped.
  const cityOptions = useMemo(() => {
    const top = cities.map((c) => c.name);
    const seen = new Set(top.map((n) => n.toLowerCase()));
    return [...top, ...indianDistricts.filter((d) => !seen.has(d.toLowerCase()))];
  }, []);

  // A free-typed city maps back to a Coffee Club slug when it is one of ours;
  // otherwise only the location text is kept.
  const cityFields = () => {
    const match = cities.find(
      (c) => c.name.toLowerCase() === cityValue.trim().toLowerCase(),
    );
    return { citySlug: match?.slug ?? "", location: cityValue.trim() };
  };

  const saveProfileStep = () => {
    saveProfile({
      fullName: fullName.trim(),
      headline: headline.trim(),
      ...cityFields(),
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
    if (handle && handle !== profile?.handle) setHandle(handle);
    setStep(FOCUS);
  };

  const saveFocusStep = () => {
    saveProfile({
      fullName: fullName.trim() || profile?.fullName || "",
      headline: headline.trim(),
      ...cityFields(),
      needs,
      stage,
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    });
    setStep(COMPANY);
  };

  const finish = (saveCompany: boolean) => {
    if (saveCompany && companyValid) {
      // Datalist allows free text; only persist a value that is a real option.
      const validIndustry = (industries as readonly string[]).includes(industry)
        ? (industry as (typeof industries)[number])
        : undefined;
      saveStartup({
        name: companyName.trim(),
        industry: validIndustry,
        description: companyBio.trim(),
        logoUrl: logoUrl.trim(),
      });
    }
    completeOnboarding();
    setStep(DONE);
  };

  return (
    <div className="grid h-[calc(100dvh-4rem)] grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1">
      {/* Left: active step inputs. Fixed-height page — this column scrolls if a
          step is taller than the viewport, so the page itself never does. */}
      <div className="order-2 min-h-0 overflow-y-auto lg:order-1">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          {step === WELCOME && (
            <section className="flex h-full flex-col justify-center space-y-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <Sparkles className="size-6" />
              </span>
              <div className="space-y-3">
                <TwoToneHeading lead="Welcome to WeCos." strong="Let's set you up." />
                <p className="max-w-md leading-relaxed text-muted-foreground">
                  Five quick steps — under two minutes. We&apos;ll build your public
                  founder profile, learn what you need, and point you at the right
                  people. Nothing here is permanent except your link.
                </p>
              </div>
              <div>
                <Button onClick={() => setStep(PROFILE)} size="lg">
                  Let&apos;s go
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          )}

          {step === PROFILE && (
            <section className="max-w-xl space-y-7">
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

                <Field
                  label="Your city"
                  htmlFor="city"
                  hint="Our five Coffee Club cities sit up top — start typing for any other district."
                >
                  <Input
                    id="city"
                    list="city-options"
                    value={cityValue}
                    onChange={(e) => setCityValue(e.target.value)}
                    placeholder="Search your city or district"
                    autoComplete="off"
                  />
                  <datalist id="city-options">
                    {cityOptions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </Field>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <StepBack onClick={() => setStep(WELCOME)} />
                <Button onClick={saveProfileStep} disabled={!profileValid} size="lg">
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          )}

          {step === FOCUS && (
            <section className="max-w-xl space-y-7">
              <div className="space-y-2">
                <TwoToneHeading lead="What do you" strong="need right now?" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Pick as many as apply. This decides who we introduce you to and
                  what we surface first — nothing is shown publicly.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Where you are</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {stages.map((s) => (
                    <Choice
                      key={s.id}
                      selected={stage === s.id}
                      onClick={() => setStage(stage === s.id ? "" : s.id)}
                      className="text-center font-medium"
                    >
                      {s.label}
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
                <StepBack onClick={() => setStep(PROFILE)} />
                <Button onClick={saveFocusStep} size="lg">
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          )}

          {step === COMPANY && (
            <section className="max-w-xl space-y-7">
              <div className="space-y-2">
                <TwoToneHeading lead="Last one —" strong="your company." />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Adding it now means people can find what you&apos;re building. It
                  stays private until you list it, and you can skip this for now.
                </p>
              </div>

              <div className="space-y-5">
                <Field label="Company name" htmlFor="companyName">
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Terracotta & Co."
                  />
                </Field>

                <Field
                  label="Industry"
                  htmlFor="industry"
                  hint="Start typing to search."
                >
                  <Input
                    id="industry"
                    list="industry-options"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Fintech"
                    autoComplete="off"
                  />
                  <datalist id="industry-options">
                    {industries.map((i) => (
                      <option key={i} value={i} />
                    ))}
                  </datalist>
                </Field>

                <Field
                  label="Short bio"
                  htmlFor="companyBio"
                  hint="A line or two on what you're building, for whom."
                >
                  <Textarea
                    id="companyBio"
                    rows={4}
                    value={companyBio}
                    onChange={(e) => setCompanyBio(e.target.value)}
                    placeholder="Sustainable homeware, reimagined for city apartments."
                  />
                </Field>

                <Field
                  label="Company logo"
                  htmlFor="logoUrl"
                  hint="Optional — paste a URL. Upload arrives with the backend phase."
                >
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <StepBack onClick={() => setStep(FOCUS)} />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => finish(false)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Skip for now
                  </button>
                  <Button onClick={() => finish(true)} disabled={!companyValid} size="lg">
                    Finish
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </section>
          )}

          {step === DONE && (
            <section className="flex h-full max-w-lg flex-col justify-center space-y-6 text-center lg:text-left">
              <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground lg:mx-0 mx-auto">
                <PartyPopper className="size-6" />
              </span>

              <TwoToneHeading lead="You're" strong="in." />

              <p className="leading-relaxed text-muted-foreground">
                Your profile is live at{" "}
                <span className="font-medium text-foreground">
                  {siteConfig.url.replace(/^https?:\/\//, "")}/{profile?.handle}
                </span>
                . The fastest way to get value out of WeCos is to say hello —
                founders who post in their first week get three times the replies.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
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
            </section>
          )}
        </div>
      </div>

      {/* Right: progress on top (small), live preview below. On mobile the rail
          collapses to a progress bar and the preview is hidden to save height. */}
      <aside className="order-1 flex min-h-0 flex-col gap-8 overflow-y-auto bg-muted/40 px-4 py-6 sm:px-8 lg:order-2 lg:py-10">
        <StepRail steps={onboardingSteps} current={step} />
        <LivePreview
          className="hidden !bg-transparent p-0 justify-start lg:flex lg:p-0"
          fullName={fullName}
          headline={headline}
          handle={handle}
          cityName={cityValue}
          needs={needs}
          companyName={companyName}
          industry={industry}
        />
      </aside>
    </div>
  );
}

function StepBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Back
    </button>
  );
}
