import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Kickoff Rugby Recruitment collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "21 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-brand-navy">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Privacy policy</h1>
            <p className="mt-3 text-sm text-slate-300">Last updated {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700 sm:px-6">
          <div className="space-y-8">
            <Block title="Who we are">
              <p>
                Kickoff Rugby Recruitment (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website to connect
                rugby players and coaches with clubs. This policy explains what personal data we collect when you
                use the site, why we collect it, and the choices and rights you have.
              </p>
              <p className="mt-2 text-slate-500">
                [Company legal name, registered address, and company/registration number to be added here.]
              </p>
            </Block>

            <Block title="What we collect">
              <p>When you create a player, coach, or club listing, or contact us, we may collect:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Contact details: name, email address, phone number.</li>
                <li>Profile information: position/specialization, level, current and desired location, nationality, years of experience, current club, and anything you choose to tell us about yourself.</li>
                <li>
                  Application documents, if you choose to provide them: a passport or ID scan, a CV, and a cover
                  letter. These help us verify eligibility and speed up review for clubs -- they are never shown on
                  any public page, only reviewed by our team.
                </li>
                <li>A photo, if you add one to your profile.</li>
                <li>Messages you send through a profile&rsquo;s inquiry form or our contact form.</li>
                <li>
                  Basic technical data (pages visited, general location, device type) through Vercel Web
                  Analytics, which is designed not to use cookies or track you across sites.
                </li>
              </ul>
            </Block>

            <Block title="How we use it">
              <ul className="list-disc space-y-1 pl-5">
                <li>To review, publish, and display your listing in our directory.</li>
                <li>To match players and coaches with clubs, and to facilitate introductions between them.</li>
                <li>To verify eligibility documents and confirm details before publishing a &ldquo;Verified&rdquo; badge.</li>
                <li>To respond to inquiries and messages sent through the site.</li>
                <li>To send account-related emails, such as password resets.</li>
                <li>To keep the site secure and understand how it&rsquo;s used, at an aggregate level.</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal data, and we do not use it for advertising or share it with
                advertisers.
              </p>
            </Block>

            <Block title="Who we share it with">
              <p>We share personal data only where it&rsquo;s needed to run the service:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  With a club or player/coach when facilitating an introduction -- always reviewed by our team
                  first, and never including your application documents unless you&rsquo;ve agreed to that specific
                  introduction.
                </li>
                <li>
                  With service providers who host and run the site on our behalf: our hosting and file storage
                  provider, our database provider, and our email provider. They only process data to provide
                  their service to us and aren&rsquo;t permitted to use it for their own purposes.
                </li>
                <li>If required by law, or to protect the rights, safety, or property of our users or the public.</li>
              </ul>
            </Block>

            <Block title="How long we keep it">
              <p>
                We keep listing and application data for as long as your profile is active, plus a reasonable
                period afterward in case you return or a placement is still being followed up on. If you ask us to
                delete your data, we will, unless we&rsquo;re required to keep something for a legitimate legal or
                administrative reason.
              </p>
            </Block>

            <Block title="Your rights">
              <p>
                Depending on where you live, you may have the right to access, correct, delete, or export your
                personal data, and to object to or restrict certain uses of it. To exercise any of these, reach
                out through our{" "}
                <Link href="/contact" className="text-brand-navy underline">
                  contact page
                </Link>
                . If you&rsquo;re in the EU or UK and aren&rsquo;t satisfied with our response, you also have the
                right to complain to your local data protection authority.
              </p>
            </Block>

            <Block title="Security">
              <p>
                We use industry-standard measures to protect your data, including encrypted connections (HTTPS)
                and access controls that keep sensitive documents (passport scans, CVs, cover letters) visible
                only to our staff, never on any public page. No system is perfectly secure, but we take
                reasonable steps to protect what you share with us.
              </p>
            </Block>

            <Block title="Children">
              <p>
                This site is intended for users aged 18 and over. If you are under 18 and want to be listed as a
                player, a parent or guardian -- or your club -- should submit your details on your behalf and
                contact us directly.
              </p>
            </Block>

            <Block title="International transfers">
              <p>
                Our hosting, database, and email providers may process data outside your home country, including
                in the United States. Where that happens, we rely on the safeguards those providers make
                available (such as standard contractual clauses) to protect your data.
              </p>
            </Block>

            <Block title="Changes to this policy">
              <p>
                We may update this policy from time to time. If we make material changes, we&rsquo;ll update the
                date at the top of this page.
              </p>
            </Block>

            <Block title="Contact us">
              <p>
                Questions about this policy or your data? Reach out through our{" "}
                <Link href="/contact" className="text-brand-navy underline">
                  contact page
                </Link>
                .
              </p>
            </Block>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-brand-coral pl-5">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <div className="mt-1">{children}</div>
    </div>
  );
}
