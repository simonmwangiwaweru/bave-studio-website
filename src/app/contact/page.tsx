import type { Metadata } from "next";
import { Suspense } from "react";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Bave Studio — photography, videography or live streaming.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight tracking-tight text-ink md:text-6xl">
            Start a project
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-graphite">
            Tell us the date, the place and what you need. The more you share,
            the faster we can quote accurately.
          </p>

          <div className="mt-10 space-y-6 text-sm">
            <div>
              <p className="eyebrow">Call or WhatsApp</p>
              <a
                href="tel:+254798108543"
                className="mt-1 block text-lg text-ink hover:text-orange"
              >
                0798 108 543
              </a>
            </div>
            <div>
              <p className="eyebrow">Email</p>
              <a
                href="mailto:studiobave9@gmail.com"
                className="mt-1 block text-lg text-ink hover:text-orange"
              >
                studiobave9@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Form sits in a white card on the canvas */}
        <div className="rounded-lg border rule bg-card p-6 md:p-8">
          <Suspense>
            <InquiryForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
