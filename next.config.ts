import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pptxgenjs and pdf-parse are Node-only packages — keep them server-side only
  serverExternalPackages: ["pptxgenjs", "pdf-parse"],
};

export default nextConfig;
