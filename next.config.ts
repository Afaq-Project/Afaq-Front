import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only reviewable documents (essays, CVs, recommendation letters) have a page: their review at
  // /documents/:id/review (other document types are sent back to /documents from there). Earlier document and review URLs point to it.
  // /reviews/:id was only linked in development builds.
  async redirects() {
    return [
      { source: "/documents/:id", destination: "/documents/:id/review", permanent: false },
      { source: "/documents/:id/reviews", destination: "/documents/:id/review", permanent: false },
      { source: "/documents/:id/reviews/:reviewId", destination: "/documents/:id/review", permanent: false },
      { source: "/reviews/:id", destination: "/documents/:id/review", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Country flags (landing FlagTile).
      { protocol: "https", hostname: "flagcdn.com", pathname: "/w80/**" },
    ],
  },
};

export default nextConfig;
