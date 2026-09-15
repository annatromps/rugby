import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Kickoff Rugby Recruitment for players, coaches, and clubs.",
};

const FAQS = [
  {
    question: "Is Kickoff Rugby Recruitment free to use?",
    answer:
      "Browsing the directory and messaging is free for players and coaches. We're a new marketplace and still finalising pricing for clubs, so see the Pricing page for the current (indicative) plans.",
  },
  {
    question: "How do I create a profile?",
    answer:
      "Use \"Join as a player\", \"Join as a coach\", or \"List your club\" from the navigation. It takes a few minutes, and you can update your details any time.",
  },
  {
    question: "How long does review take before my profile goes live?",
    answer:
      "A member of our team checks new listings before they go live, usually within a day or two. You'll still be able to see and edit your own submission while it's pending.",
  },
  {
    question: "What does the \"Verified\" badge mean?",
    answer:
      "It's a manual check by our team confirming a listing is a real person or club with working contact details. It's meant to build trust in a brand-new marketplace: an unverified listing isn't necessarily untrustworthy, just not yet checked.",
  },
  {
    question: "How do clubs, players, and coaches get in touch with each other?",
    answer:
      "Every public profile has a short inquiry form. Send a message from a profile page and it goes straight to that listing's contact history, which our team can also help follow up on.",
  },
  {
    question: "Is my contact information visible to everyone?",
    answer:
      "No. Your public profile shows what you choose to list (position, level, location, and so on), but your email and phone number are only used for us and interested parties to reach you. They aren't displayed on the page.",
  },
  {
    question: "Can I update or remove my listing?",
    answer:
      "Yes, contact us and we'll update or take down your listing. Self-serve account editing is on our roadmap.",
  },
  {
    question: "Do you help with relocation?",
    answer:
      "Once a conversation between a player/coach and a club is underway, our team can help with the practical side: references, relocation support, and anything else that comes up moving from a first message to a signed deal.",
  },
  {
    question: "I have another question, who do I ask?",
    answer: "Reach out any time through our contact page and we'll get back to you.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-brand-navy">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Frequently asked questions</h1>
            <p className="mt-3 text-base text-slate-200">
              Everything you need to know about using Kickoff Rugby Recruitment.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <dl className="space-y-8">
            {FAQS.map((item) => (
              <div key={item.question} className="border-l-2 border-brand-coral pl-5">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-1 text-sm text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">Still have questions?</h2>
            <Link
              href="/contact"
              className="rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
