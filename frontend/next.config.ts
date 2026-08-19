import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo: LEASYSTEM is the file-tracing root (two lockfiles exist).
  outputFileTracingRoot: path.join(__dirname, "../"),
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "leasystem-jgtiwg7u.manus.space" },
    ],
  },
};

export default nextConfig;
