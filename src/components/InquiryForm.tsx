"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const services = [
  { value: "photography", label: "Photography" },
  { value: "videography", label: "Videography" },
  { value: "live-streaming", label: "Live Streaming" },
  { value: "multiple", label: "More than one" },
];

const budgets = [
  "Under KSh 20,000",
  "KSh 20,000 – 50,000",
  "KSh 50,000 – 100,000",
  "Over KSh 100,000",
  "Not sure yet",
];

const inputCls =
  "w-full rounded-lg border rule bg-parchment/60 px-4 py-3 text-sm text-ink placeholder:text-ash focus:border-ink focus:outline-none";

export default function InquiryForm() {
  const params = useSearchParams();
  const preset = params.get("service") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="p-4 text-center md:p-8">
        <p className="font-display text-2xl text-ink">Thank you!</p>
        <p className="mt-3 text-graphite">
          Your inquiry is in. We usually reply within one business day — if
          it’s urgent, call{" "}
          <a href="tel:+254798108543" className="text-ink underline">
            0798 108 543
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it in */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-2 block">
            Your name *
          </label>
          <input id="name" name="name" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="contact" className="eyebrow mb-2 block">
            Phone or email *
          </label>
          <input id="contact" name="contact" required className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="eyebrow mb-2 block">
          What do you need? *
        </label>
        <select
          id="service"
          name="service"
          required
          defaultValue={preset}
          className={inputCls}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="eyebrow mb-2 block">
            Event date
          </label>
          <input id="date" name="date" type="date" className={inputCls} />
        </div>
        <div>
          <label htmlFor="location" className="eyebrow mb-2 block">
            Location
          </label>
          <input
            id="location"
            name="location"
            placeholder="Venue or town"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="eyebrow mb-2 block">
          Tell us about it *
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={5}
          placeholder="The event, the audience, anything you already know you want."
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="budget" className="eyebrow mb-2 block">
          Budget indication
        </label>
        <select id="budget" name="budget" defaultValue="" className={inputCls}>
          <option value="">Prefer not to say</option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {status === "error" && (
        <p className="text-sm text-orange">
          Something went wrong sending that. Please try again, or email{" "}
          <a href="mailto:studiobave9@gmail.com" className="underline">
            studiobave9@gmail.com
          </a>{" "}
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-fill !px-7 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
