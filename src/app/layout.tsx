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
  title: "ClubMatch Admin",
  description: "Rugby club and player recruitment platform -- admin tools",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
