import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  serverExternalPackages: ["@react-pdf/renderer", "@rawwee/react-pdf-html"],
};

export default nextConfig;
