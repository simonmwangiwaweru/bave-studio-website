import type { Metadata } from "next";
import { getSiteSettings, labelForSocialUrl } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Bave Studio directly by phone, WhatsApp or email — photography, videography and live streaming.",
};

export const revalidate = 60;

const DEFAULT_PHONE = "0798 108 543";
const DEFAULT_PHONE_TEL = "+254798108543";
const DEFAULT_EMAIL = "studiobave9@gmail.com";
const DEFAULT_WHATSAPP = "254798108543";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phoneDisplay = settings?.phone || DEFAULT_PHONE;
  const phoneDigits = settings?.phone?.replace(/\D/g, "");
  const phoneTel = phoneDigits
    ? `+${phoneDigits.replace(/^0/, "254")}`
    : DEFAULT_PHONE_TEL;
  const email = settings?.email || DEFAULT_EMAIL;
  const whatsapp = settings?.whatsapp || DEFAULT_WHATSAPP;
  const socials = settings?.socialLinks ?? [];

  const links = [
    {
      label: "Call",
      value: phoneDisplay,
      href: `tel:${phoneTel}`,
    },
    {
      label: "WhatsApp",
      value: "Message us directly",
      href: `https://wa.me/${whatsapp}`,
    },
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
        Let’s talk about your project.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-graphite">
        Reach out directly — whichever is easiest. We usually reply within one
        business day.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="group rounded-lg border rule bg-card p-7 transition-colors hover:border-ink"
          >
            <p className="eyebrow">{l.label}</p>
            <p className="mt-3 font-display text-xl text-ink">{l.value}</p>
            <span className="mt-6 inline-block text-sm text-ash transition-colors group-hover:text-orange">
              Open →
            </span>
          </a>
        ))}
      </div>

      {socials.length > 0 && (
        <div className="mt-16">
          <p className="eyebrow mb-5">Follow the work</p>
          <ul className="flex flex-wrap gap-2.5">
            {socials.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tag transition-colors hover:border-ink"
                >
                  {labelForSocialUrl(url)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
