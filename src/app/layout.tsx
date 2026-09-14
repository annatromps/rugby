import type { Metadata } from "next";
import "./globals.css";

// Deliberately using the system font stack (see globals.css) instead of
// next/font/google: fetching a font from Google Fonts at build time adds a
// network dependency to every build, which fails outright on networks that
// block fonts.googleapis.com (as this sandbox does) or have no egress at
// all. System fonts render instantly, need no download, and look native on
// every platform -- a good tradeoff for an admin tool. If you want a brand
// typeface later, self-host it with next/font/local instead.

export const metadata: Metadata = {
  title: {
    default: "Kickoff Rugby Recruitment",
    template: "%s | Kickoff Rugby Recruitment",
  },
  description:
    "Where rugby players and clubs find each other -- browse players, browse clubs, and connect directly.",
  icons: {
    icon: "/kickoff-rugby-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
