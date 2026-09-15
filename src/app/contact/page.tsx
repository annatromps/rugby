import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the Kickoff Rugby Recruitment team.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Contact us</h1>
          <p className="mt-2 text-sm text-slate-600">
            Questions about your listing, a partnership, or anything else: send us a message and a member
            of our team will get back to you.
          </p>
        </div>
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
