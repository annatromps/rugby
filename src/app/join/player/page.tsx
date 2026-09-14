import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PlayerApplicationForm } from "@/components/public/player-application-form";

export default function JoinPlayerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Join as a player</h1>
        <p className="mt-1 text-sm text-slate-600">
          List yourself in our players directory so clubs can find you.
          It&apos;s free, and your profile is reviewed before it goes live.
        </p>
        <div className="mt-6">
          <PlayerApplicationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
