"use client";

import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { handlePattern, reservedHandles, siteConfig } from "@/config/site";

export type HandleState =
  | { status: "empty" }
  | { status: "checking" }
  | { status: "ok" }
  | { status: "error"; reason: string };

/**
 * Validates a handle for shape and reserved words.
 *
 * ⚠️ MOCK: uniqueness across users cannot be checked without a server. The real
 * implementation needs a unique index on `profile.handle` plus a debounced
 * availability lookup — hence the `checking` state, which exists so the UI does
 * not have to change when that lands.
 */
export function checkHandle(raw: string): HandleState {
  const handle = raw.trim().toLowerCase();
  if (!handle) return { status: "empty" };
  if (handle.length < 2) return { status: "error", reason: "At least 2 characters." };
  if (handle.length > 39) return { status: "error", reason: "39 characters maximum." };
  if (!handlePattern.test(handle)) {
    return {
      status: "error",
      reason: "Letters, numbers, hyphens and underscores. Must start with a letter or number.",
    };
  }
  if (reservedHandles.has(handle)) {
    return { status: "error", reason: "That one's reserved. Try another." };
  }
  return { status: "ok" };
}

const host = siteConfig.url.replace(/^https?:\/\//, "");

/**
 * Handle claim field. Shown as a live URL preview rather than a bare input,
 * because the value *is* a URL and founders should see what they are choosing.
 */
export function HandleField({
  value,
  onChange,
  state,
}: {
  value: string;
  onChange: (v: string) => void;
  state: HandleState;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="handle" className="text-sm font-medium">
        Your WeCos link
      </label>

      <div
        className={cn(
          "flex items-center rounded-lg border bg-background transition-colors focus-within:ring-2 focus-within:ring-ring/50",
          state.status === "error"
            ? "border-destructive focus-within:border-destructive"
            : "border-input focus-within:border-primary",
        )}
      >
        <span className="pl-3 text-sm whitespace-nowrap text-muted-foreground select-none">
          {host}/
        </span>
        <Input
          id="handle"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          placeholder="yourname"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={state.status === "error"}
          aria-describedby="handle-status"
          className="border-0 bg-transparent px-1 shadow-none focus-visible:border-0 focus-visible:ring-0"
        />
        <span className="grid w-9 shrink-0 place-items-center">
          {state.status === "checking" && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
          {state.status === "ok" && <Check className="size-4 text-success" />}
          {state.status === "error" && <X className="size-4 text-destructive" />}
        </span>
      </div>

      <p
        id="handle-status"
        role={state.status === "error" ? "alert" : undefined}
        className={cn(
          "text-xs",
          state.status === "error" ? "font-medium text-destructive" : "text-muted-foreground",
        )}
      >
        {state.status === "error"
          ? state.reason
          : state.status === "ok"
            ? "Available. This is permanent — choose carefully."
            : "This is your public profile address."}
      </p>
    </div>
  );
}
