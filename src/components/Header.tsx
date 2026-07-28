"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b rule bg-parchment/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          Bave&nbsp;Studio
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-orange"
                  : "text-graphite hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-fill">
            Start a project
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform ${
                  open ? "top-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-full bg-ink transition-transform ${
                  open ? "bottom-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-parchment md:hidden">
          <nav
            className="flex flex-col gap-1 px-5 pt-6"
            aria-label="Primary mobile"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b rule py-4 font-display text-2xl font-light text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-5 pb-10">
            <Link
              href="/contact"
              className="btn-fill block w-full text-center !py-3.5"
            >
              Start a project
            </Link>
            <p className="mt-4 text-center text-sm text-graphite">
              or call{" "}
              <a href="tel:+254798108543" className="text-ink underline">
                0798 108 543
              </a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
