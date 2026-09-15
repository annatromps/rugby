import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Player/coach photos and club crests are uploaded to Vercel Blob
    // (see src/app/actions/photos.ts) -- every store's public files are
    // served from a per-store subdomain of this host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    // Default body size limit (1MB) is too small for a photo upload.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
