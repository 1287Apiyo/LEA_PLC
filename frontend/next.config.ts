
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase App Hosting expects the standalone server bundle and route manifest.
  output: "standalone",
  // App Hosting builds from frontend/, so keep the standalone bundle rooted here.
  outputFileTracingRoot: __dirname,
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "leasystem-jgtiwg7u.manus.space" },
    ],
  },
};

export default nextConfig;
