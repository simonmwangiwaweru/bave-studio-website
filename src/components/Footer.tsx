import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t rule">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-paper">Bave Studio</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper-muted">
              Photography, videography and live streaming — events, weddings,
              corporate and commercial work.
            </p>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["/photography", "Photography"],
                ["/videography", "Videography"],
                ["/live-streaming", "Live Streaming"],
                ["/about", "About"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-paper-muted transition-colors hover:text-paper"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Get in touch</p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper-muted">
              <li>
                <a
                  href="tel:+254798108543"
                  className="transition-colors hover:text-paper"
                >
                  0798 108 543
                </a>
              </li>
              <li>
                <a
                  href="mailto:studiobave9@gmail.com"
                  className="transition-colors hover:text-paper"
                >
                  studiobave9@gmail.com
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full border border-amber px-5 py-2 text-sm text-amber transition-colors hover:bg-amber hover:text-ink"
            >
              Start a project
            </Link>
          </div>
        </div>

        <p className="mt-12 border-t rule pt-6 text-xs text-paper-faint">
          © {new Date().getFullYear()} Bave Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
