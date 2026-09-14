import type { MetadataRoute } from "next";

const SITE_URL = "https://rugby-snowy.vercel.app"; // update once a custom domain is live

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
