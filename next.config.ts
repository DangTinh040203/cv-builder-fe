import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@react-pdf/renderer",
      "@rawwee/react-pdf-html",
    ],
  },
};

export default nextConfig;
