"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { logOutAccount } from "@/app/actions/portal-auth";
import { logout as logOutAdmin } from "@/app/actions/auth";

const PRIMARY_LINKS = [
  { href: "/players", label: "Find players" },
  { href: "/clubs", label: "Find clubs" },
  { href: "/coaches", label: "Find coaches" },
];

const MORE_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Athlete services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const SIGN_UP_OPTIONS = [
  { href: "/join/player", label: "I'm a player" },
  { href: "/join/club", label: "I'm a club" },
  { href: "/join/coach", label: "I'm a coach" },
];

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onOutside]);
  return ref;
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="More"
        className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        More
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {MORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SignUpMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="whitespace-nowrap rounded-md bg-brand-coral px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-coral-dark"
      >
        Sign up
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {SIGN_UP_OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
            >
              {option.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeaderNav({
  accountName,
  adminName,
}: {
  accountName: string | null;
  adminName?: string | null;
}) {
  return (
    <header className="border-b border-white/10 bg-brand-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/kickoff-rugby-icon.png"
            alt="Kickoff Rugby Recruitment"
            width={600}
            height={377}
            priority
            className="h-8 w-auto sm:h-9"
          />
          <span className="hidden text-base font-extrabold uppercase tracking-tight text-white sm:inline">
            Kickoff Rugby
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 sm:gap-2">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <MoreMenu />
          <span className="h-6 w-px bg-white/20" aria-hidden="true" />
          {adminName ? (
            <>
              <Link
                href="/admin"
                className="hidden whitespace-nowrap text-sm text-slate-300 hover:text-white sm:inline"
              >
                Hi, {adminName.split(" ")[0]} (Staff)
              </Link>
              <form action={logOutAdmin}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-md border border-white/25 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </>
          ) : accountName ? (
            <>
              <span className="hidden whitespace-nowrap text-sm text-slate-300 sm:inline">
                Hi, {accountName.split(" ")[0]}
              </span>
              <form action={logOutAccount}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-md border border-white/25 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-slate-300 hover:text-white"
              >
                Log in
              </Link>
              <SignUpMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
