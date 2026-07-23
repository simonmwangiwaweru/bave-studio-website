"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/photography", label: "Photography" },
  { href: "/videography", label: "Videography" },
  { href: "/live-streaming", label: "Live Streaming" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b rule bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-paper"
        >
          Bave&nbsp;Studio
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-paper"
                  : "text-paper-muted hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-amber px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-amber-deep"
          >
            Start a project
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform ${
                open ? "top-1/2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-px w-full bg-paper transition-transform ${
                open ? "bottom-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-ink md:hidden">
          <nav
            className="flex flex-col gap-1 px-5 pt-6"
            aria-label="Primary mobile"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b rule py-4 font-display text-2xl text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-5 pb-10">
            <Link
              href="/contact"
              className="block rounded-full bg-amber px-6 py-3.5 text-center font-medium text-ink"
            >
              Start a project
            </Link>
            <p className="mt-4 text-center text-sm text-paper-muted">
              or call{" "}
              <a href="tel:+254798108543" className="text-paper underline">
                0798 108 543
              </a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
