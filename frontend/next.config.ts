import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Monorepo: LEASYSTEM is the file-tracing root (two lockfiles exist).
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
