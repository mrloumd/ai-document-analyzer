import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse v2 is an ESM package — transpile it for Node.js server-side usage
  transpilePackages: ["pdf-parse"],
  // pptxgenjs is a heavy Node-only package — keep it server-side only
  serverExternalPackages: ["pptxgenjs"],
};

export default nextConfig;
