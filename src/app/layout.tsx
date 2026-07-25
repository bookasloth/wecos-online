import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { siteConfig } from "@/config/site";
// Self-hosted Open Sauce Sans (matches existing WeCos brand). Latin subset only.
import "@fontsource/open-sauce-sans/latin-400.css";
import "@fontsource/open-sauce-sans/latin-500.css";
import "@fontsource/open-sauce-sans/latin-600.css";
import "@fontsource/open-sauce-sans/latin-700.css";
import "@fontsource/open-sauce-sans/latin-800.css";
import "./globals.css";

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WeCos — India's Startup Engine",
    template: "%s · WeCos",
  },
  description:
    "Build better, prove faster, grow stronger. WeCos helps founders turn ideas into validated startups — powered by AI systems and guided by human mentors.",
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
