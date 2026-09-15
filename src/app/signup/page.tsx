import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free account to see full profiles and contact players, coaches, and clubs.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create your free account</h1>
          <p className="mt-1 text-sm text-slate-500">
            See full names, photos, and contact details, and get in touch with players, coaches, and clubs.
          </p>
        </div>
        <SignUpForm />
      </main>
      <SiteFooter />
    </div>
  );
}
