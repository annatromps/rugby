import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ClubApplicationForm } from "@/components/public/club-application-form";

export const metadata: Metadata = {
  title: "List your club",
  description: "List your club in the directory so players can find you and see your open positions.",
};

export default function JoinClubPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">List your club</h1>
        <p className="mt-1 text-sm text-slate-600">
          List your club in our directory so players can find you and see
          your open positions. It&apos;s free, and listings are reviewed
          before going live.
        </p>
        <div className="mt-6">
          <ClubApplicationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
