"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthSync } from "@/features/auth/auth-sync";

/**
 * Composition root for all client-side providers.
 * Add future providers here (TanStack Query, tooltip, etc.) so layout.tsx
 * stays a single wrapper and provider order lives in one place.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthSync />
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
