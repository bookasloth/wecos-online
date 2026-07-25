import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // URL scheme change: founders moved to root-level vanity handles
      // (/u/shubham → /shubham) and startups to /venture/*. Permanent so any
      // existing links and search-engine records follow.
      { source: "/u/:handle", destination: "/:handle", permanent: true },
      { source: "/startup/:slug", destination: "/venture/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
