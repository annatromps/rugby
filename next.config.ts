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
    // The demo/placeholder avatars and club crests under public/demo are
    // hand-authored SVGs we control (no user-uploaded content), rendered
    // through next/image like any other local asset. Next disables SVG
    // optimization by default as an XSS precaution for untrusted images;
    // this re-enables it with the CSP Next's own docs recommend so an SVG
    // response can never execute a script even if that ever changed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // Default body size limit (1MB) is too small for a photo upload.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
