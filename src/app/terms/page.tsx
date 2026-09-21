import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that govern your use of Kickoff Rugby Recruitment.",
};

const LAST_UPDATED = "21 September 2026";

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-brand-navy">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Terms of service</h1>
            <p className="mt-3 text-sm text-slate-300">Last updated {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700 sm:px-6">
          <div className="space-y-8">
            <Block title="1. Agreement to these terms">
              <p>
                By using Kickoff Rugby Recruitment (&ldquo;the site&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;),
                you agree to these terms. If you don&rsquo;t agree, please don&rsquo;t use the site.
              </p>
              <p className="mt-2 text-slate-500">
                [Company legal name, registered address, and company/registration number to be added here.]
              </p>
            </Block>

            <Block title="2. What we do">
              <p>
                We run a directory that connects rugby players and coaches looking for a club with clubs looking
                to fill a position. At this stage, matching between clubs and players is coordinated manually by
                our team -- we review new listings before they go live and help facilitate introductions, but we
                don&rsquo;t guarantee a match, a trial, or a placement for anyone.
              </p>
            </Block>

            <Block title="3. Eligibility and accounts">
              <ul className="list-disc space-y-1 pl-5">
                <li>You must be 18 or older to create an account yourself. A parent, guardian, or club may submit a younger player&rsquo;s details on their behalf.</li>
                <li>You&rsquo;re responsible for the accuracy of the information in your listing, and for keeping your login details confidential.</li>
                <li>You&rsquo;re responsible for anything that happens through your account.</li>
              </ul>
            </Block>

            <Block title="4. Your content and documents">
              <p>
                You&rsquo;re responsible for anything you submit -- your profile details, photo, CV, cover letter,
                or identity documents -- and you confirm you have the right to share it and that it&rsquo;s
                accurate. You can ask us to update or remove your listing at any time through our{" "}
                <Link href="/contact" className="text-brand-navy underline">
                  contact page
                </Link>
                .
              </p>
            </Block>

            <Block title="5. The &ldquo;Verified&rdquo; badge">
              <p>
                A &ldquo;Verified&rdquo; badge means a member of our team has done a manual check confirming a
                listing appears to be a real person or club with working contact details. It is not a background
                check, a reference check, or a guarantee of ability, character, or eligibility to work or play in
                any jurisdiction.
              </p>
            </Block>

            <Block title="6. Fees">
              <p>
                Current pricing is shown on our{" "}
                <Link href="/pricing" className="text-brand-navy underline">
                  Pricing page
                </Link>{" "}
                and is indicative while we finalize our commercial terms. We&rsquo;ll always confirm pricing with
                you directly before charging anything.
              </p>
            </Block>

            <Block title="7. Acceptable use">
              <p>You agree not to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Submit false, misleading, or someone else&rsquo;s information as your own.</li>
                <li>Use the site to harass, discriminate against, or misrepresent yourself to another user.</li>
                <li>Scrape, copy, or republish listings or content from the site without our permission.</li>
                <li>Attempt to interfere with the security or normal operation of the site.</li>
              </ul>
            </Block>

            <Block title="8. Work permits, eligibility, and legal responsibility">
              <p>
                Any visa, work permit, eligibility, contractual, or immigration requirements involved in a player
                or coach joining a club are the responsibility of the individuals and clubs involved, not
                Kickoff Rugby Recruitment. We may help point you toward resources or support, but we don&rsquo;t
                provide legal, immigration, or employment advice.
              </p>
            </Block>

            <Block title="9. Disclaimer and limitation of liability">
              <p>
                The site is provided &ldquo;as is&rdquo;. We do our best to keep listings accurate and the site
                running smoothly, but we don&rsquo;t guarantee the accuracy of any listing (including ones
                submitted by other users), or that the site will be uninterrupted or error-free. To the fullest
                extent permitted by law, we aren&rsquo;t liable for any indirect, incidental, or consequential
                damages arising from your use of the site, or from any introduction, placement, or arrangement
                made between users.
              </p>
            </Block>

            <Block title="10. Ending your listing">
              <p>
                You can ask us to remove your listing or account at any time. We may also remove or suspend a
                listing that violates these terms or that we reasonably believe is false or misleading, with
                notice where practical.
              </p>
            </Block>

            <Block title="11. Changes to these terms">
              <p>
                We may update these terms from time to time. If we make material changes, we&rsquo;ll update the
                date at the top of this page. Continuing to use the site after a change means you accept the
                updated terms.
              </p>
            </Block>

            <Block title="12. Governing law">
              <p className="text-slate-500">[Governing law and jurisdiction to be added here.]</p>
            </Block>

            <Block title="13. Contact us">
              <p>
                Questions about these terms? Reach out through our{" "}
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
