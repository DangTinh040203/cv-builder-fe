/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@shared/ui"],
  serverExternalPackages: ["@react-pdf/renderer", "@rawwee/react-pdf-html"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
