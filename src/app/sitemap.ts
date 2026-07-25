import type { MetadataRoute } from "next";
import { siteConfig, cities, studios, resources } from "@/config/site";
import { blogPosts } from "@/lib/blog-data";
import { startups, founders } from "@/lib/sample/sample-data";

const url = (path: string) => `${siteConfig.url}${path}`;

/**
 * Public marketing surface only — authenticated routes are excluded here and in
 * robots.ts. Startup/founder entries come from the sample data layer today; they
 * will follow the real directory automatically once it replaces sample-data.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about",
    "/membership",
    "/validate",
    "/startups",
    "/founders",
    "/studios",
    "/coffee-clubs",
    "/resources",
    "/resources/blog",
  ];

  return [
    ...staticPaths.map((path) => ({ url: url(path) })),
    ...cities.map((c) => ({ url: url(`/coffee-clubs/${c.slug}`) })),
    ...studios.map((s) => ({ url: url(`/studios/${s.slug}`) })),
    ...resources.map((r) => ({ url: url(`/resources/${r.slug}`) })),
    ...blogPosts.map((p) => ({ url: url(`/resources/blog/${p.slug}`) })),
    ...startups.map((s) => ({ url: url(`/venture/${s.slug}`) })),
    ...founders.map((f) => ({ url: url(`/${f.handle}`) })),
  ];
}
