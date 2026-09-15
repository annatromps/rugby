import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Deliberately using the system font stack (see globals.css) instead of
// next/font/google: fetching a font from Google Fonts at build time adds a
// network dependency to every build, which fails outright on networks that
// block fonts.googleapis.com (as this sandbox does) or have no egress at
// all. System fonts render instantly, need no download, and look native on
// every platform -- a good tradeoff for an admin tool. If you want a brand
// typeface later, self-host it with next/font/local instead.

const SITE_URL = "https://rugby-snowy.vercel.app"; // update once a custom domain is live
const SITE_DESCRIPTION =
  "Where rugby players and clubs find each other. Browse players, browse clubs, and connect directly.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kickoff Rugby Recruitment",
    template: "%s | Kickoff Rugby Recruitment",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/kickoff-rugby-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Kickoff Rugby Recruitment",
    title: "Kickoff Rugby Recruitment",
    description: SITE_DESCRIPTION,
    images: [{ url: "/kickoff-rugby-logo.png", width: 176, height: 69 }],
  },
  twitter: {
    card: "summary",
    title: "Kickoff Rugby Recruitment",
    description: SITE_DESCRIPTION,
    images: ["/kickoff-rugby-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
