import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ServiceRequestForm } from "@/components/public/service-request-form";

export const metadata: Metadata = {
  title: "Athlete services",
  description: "CV help, finding accommodation, and visa & relocation support for players moving clubs.",
};

const SERVICES = [
  {
    title: "CV help",
    description:
      "A rugby CV is different from any other job application. We'll help you present your playing history, stats, and highlights so clubs take notice.",
  },
  {
    title: "Finding accommodation",
    description:
      "Moving to a new city or country for a club? We help players find somewhere to live close to the club, within budget, before they arrive.",
  },
  {
    title: "Visa & relocation support",
    description:
      "Work permits, visas, and the logistics of moving country are the biggest hurdle for a lot of transfers. We point you toward the right process and help where we can.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Athlete services</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Getting a trial or a contract is only half the job. We also help players handle everything
            around the move itself.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">{service.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-center text-lg font-semibold text-slate-900">Request help</h2>
          <ServiceRequestForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
