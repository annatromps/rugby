"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/clubs", label: "Clubs" },
  { href: "/admin/players", label: "Players" },
  { href: "/admin/coaches", label: "Coaches" },
  { href: "/admin/sourcing", label: "AI Sourcing" },
  { href: "/admin/settings/email-templates", label: "Email Templates" },
  { href: "/admin/settings/pricing", label: "Pricing" },
  { href: "/admin/settings/testimonials", label: "Testimonials" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={`flex flex-col gap-0.5 ${className}`}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-navy/[0.08] text-brand-navy"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-brand-coral" : "bg-transparent"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
