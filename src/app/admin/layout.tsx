import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth/dal";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white sm:flex sm:flex-col">
          <Link href="/admin" className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-4">
            <Image
              src="/kickoff-rugby-favicon.png"
              alt="Kickoff Rugby Recruitment"
              width={512}
              height={512}
              priority
              className="h-9 w-9 rounded-md"
            />
            <span className="text-sm font-extrabold uppercase leading-tight tracking-tight text-brand-navy">
              Kickoff Rugby
            </span>
          </Link>
          <AdminNav className="flex-1 p-3" />
          <div className="border-t border-slate-100 p-3">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-slate-400">Signed in as</p>
            <p className="truncate px-3 text-sm font-medium text-slate-700">{admin.name}</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <p className="text-sm font-semibold text-brand-navy sm:hidden">Kickoff Rugby Recruitment</p>
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-medium text-slate-500 hover:text-brand-navy"
              >
                View site &#8599;
              </Link>
              <span className="hidden text-sm text-slate-600 sm:inline">{admin.name}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-slate-500 hover:text-brand-navy"
                >
                  Sign out
                </button>
              </form>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
