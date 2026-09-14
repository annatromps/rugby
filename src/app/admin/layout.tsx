import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/players", label: "Players" },
  { href: "/admin/sourcing", label: "AI Sourcing" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white sm:block">
          <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
              CM
            </div>
            <span className="text-sm font-semibold text-slate-900">
              ClubMatch
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 p-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <p className="text-sm text-slate-500 sm:hidden">ClubMatch</p>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-slate-600">{admin.name}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900"
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
