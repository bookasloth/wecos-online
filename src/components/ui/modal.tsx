"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Overlay + panel for the hand-rolled modals across the marketing pages.
 *
 * The class names are the ones the four call sites already used, so this is a
 * drop-in with no visual change. What it adds is the dialog semantics they were
 * all missing: `role="dialog"` + `aria-modal`, a focus trap, initial focus,
 * focus restoration on close, Escape to dismiss, and a background scroll lock.
 *
 * `title` is wired to `aria-labelledby` — render the visible heading through the
 * `title` prop rather than as a child so assistive tech announces the dialog.
 *
 * ponytail: not routed through ui/dialog.tsx because that would change the
 * animation and panel chrome; this keeps the existing look byte-for-byte.
 */
export function Modal({
  onClose,
  title,
  titleAction,
  panelClassName,
  closeOnBackdrop = false,
  children,
}: {
  onClose: () => void;
  title: string;
  /** Rendered to the right of the title — normally the × close button. */
  titleAction?: ReactNode;
  panelClassName?: string;
  /** Off by default so existing modals keep their click-through-proof behavior. */
  closeOnBackdrop?: boolean;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first control, falling back to the panel itself.
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl outline-none",
          panelClassName,
        )}
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          {titleAction}
        </div>
        {children}
      </div>
    </div>
  );
}
