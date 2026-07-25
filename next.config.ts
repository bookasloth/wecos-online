import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // URL scheme change: founders moved to root-level vanity handles
      // (/u/shubham → /shubham). Permanent so existing links and search-engine
      // records follow. The canonical company page is now /startup/:slug;
      // /venture and /business redirect to it from their route pages.
      { source: "/u/:handle", destination: "/:handle", permanent: true },
    ];
  },
};

export default nextConfig;
