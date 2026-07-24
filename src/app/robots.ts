import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated + auth-flow routes carry no crawlable content.
      disallow: ["/dashboard", "/feed", "/onboarding", "/api", "/sign-in", "/sign-up", "/forgot-password"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
