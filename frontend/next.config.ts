
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel detects and deploys this Next.js application directly from frontend/.
  // Do not use `output: "standalone"`: that setting was only needed by the
  // previous Firebase App Hosting deployment.
  serverExternalPackages: ["pdfkit"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "leasystem-jgtiwg7u.manus.space" },
    ],
  },
};

export default nextConfig;
