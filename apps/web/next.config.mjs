/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@shared/ui"],
  serverExternalPackages: ["@react-pdf/renderer", "@rawwee/react-pdf-html"],

  // Optimize package imports - tree shake heavy libraries
  optimizePackageImports: [
    "lucide-react",
    "framer-motion",
    "@clerk/nextjs",
    "react-hook-form",
    "@hookform/resolvers",
    "@reduxjs/toolkit",
    "react-redux",
    "zod",
    "@shared/ui",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Compression & performance
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
