import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back.</p>
        </div>
        <SignInForm />
      </main>
      <SiteFooter />
    </div>
  );
}
