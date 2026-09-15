"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { logOutAccount } from "@/app/actions/portal-auth";

const PRIMARY_LINKS = [
  { href: "/players", label: "Find players" },
  { href: "/clubs", label: "Find clubs" },
  { href: "/coaches", label: "Find coaches" },
];

const MORE_LINKS = [
  { href: "/how-it-works", label: "How it works" },
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
        className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
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
        className="whitespace-nowrap rounded-md border border-brand-navy px-2.5 py-1.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
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

export function SiteHeaderNav({ accountName }: { accountName: string | null }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/kickoff-rugby-logo.png"
            alt="Kickoff Rugby Recruitment"
            width={176}
            height={69}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="flex flex-1 items-center gap-1 sm:gap-2">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <MoreMenu />
          <span className="h-6 w-px bg-slate-200" aria-hidden="true" />
          {accountName ? (
            <>
              <span className="hidden whitespace-nowrap text-sm text-slate-600 sm:inline">
                Hi, {accountName.split(" ")[0]}
              </span>
              <form action={logOutAccount}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-navy"
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
