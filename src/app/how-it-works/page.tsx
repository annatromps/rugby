import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "How it works",
  description: "How Kickoff Rugby Recruitment connects players, coaches, and clubs.",
};

const STEPS = [
  {
    title: "1. Create a profile",
    body: "Players list position, level, and experience. Coaches list their specialization and coaching level. Clubs list their league, level, and open positions. It takes a few minutes, and you can update it any time.",
  },
  {
    title: "2. We review it",
    body: "A member of our team checks new listings before they go live, and verified clubs and players get a badge on their profile -- so everyone browsing the directory can trust what they're looking at.",
  },
  {
    title: "3. Get discovered",
    body: "Anyone can browse and search the directory -- no account needed to look around. Filter by position, country, level, or league to find the right fit.",
  },
  {
    title: "4. Connect directly",
    body: "Message a player, coach, or club straight from their profile once you're signed in. No middleman reading your messages -- just a direct line to start the conversation.",
  },
  {
    title: "5. We help close the deal",
    body: "Once a conversation is underway, our team can help with the practical side -- references, relocation support, and anything else that comes up moving from a first message to a signed player.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-brand-navy">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">How it works</h1>
            <p className="mt-3 text-base text-slate-200">
              A straightforward path from creating a profile to signing with a club.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <ol className="space-y-8">
            {STEPS.map((step) => (
              <li key={step.title} className="border-l-2 border-brand-coral pl-5">
                <h2 className="font-semibold text-slate-900">{step.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">Ready to create your profile?</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/join/player"
                className="rounded-md border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
              >
                Join as a player
              </Link>
              <Link
                href="/join/club"
                className="rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
              >
                List your club
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
