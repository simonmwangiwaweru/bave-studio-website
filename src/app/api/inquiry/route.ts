import { NextResponse } from "next/server";

const TO_EMAIL = process.env.INQUIRY_TO_EMAIL ?? "studiobave9@gmail.com";
// Resend's shared sender works out of the box; switch to an address on the
// studio's own domain once one is verified in Resend.
const FROM_EMAIL =
  process.env.INQUIRY_FROM_EMAIL ?? "Bave Studio <onboarding@resend.dev>";

const serviceLabels: Record<string, string> = {
  photography: "Photography",
  videography: "Videography",
  "live-streaming": "Live Streaming",
  multiple: "More than one service",
};

async function sendEmail(payload: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return { skipped: false };
}

export async function POST(request: Request) {
  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot: real users never fill this field
  if (data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const { name, contact, service, details } = data;
  if (!name?.trim() || !contact?.trim() || !service?.trim() || !details?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const serviceLabel = serviceLabels[service] ?? service;
  const contactIsEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());

  const notification = [
    `New inquiry from the website`,
    ``,
    `Name:      ${name}`,
    `Contact:   ${contact}`,
    `Service:   ${serviceLabel}`,
    `Date:      ${data.date || "—"}`,
    `Location:  ${data.location || "—"}`,
    `Budget:    ${data.budget || "—"}`,
    ``,
    `Details:`,
    details,
  ].join("\n");

  try {
    const result = await sendEmail({
      to: TO_EMAIL,
      subject: `Inquiry: ${serviceLabel} — ${name}`,
      text: notification,
      replyTo: contactIsEmail ? contact.trim() : undefined,
    });

    // Auto-acknowledgement, only when the visitor left an email address
    if (!result.skipped && contactIsEmail) {
      await sendEmail({
        to: contact.trim(),
        subject: "We received your inquiry — Bave Studio",
        text: [
          `Hi ${name},`,
          ``,
          `Thanks for reaching out about ${serviceLabel.toLowerCase()}.`,
          `Your inquiry is in and we usually reply within one business day.`,
          ``,
          `If it's urgent, call or WhatsApp 0798 108 543.`,
          ``,
          `— Bave Studio`,
        ].join("\n"),
      });
    }

    if (result.skipped) {
      // No API key configured yet — accept the submission so the form flow
      // still works in development, and log it for visibility.
      console.log("[inquiry — email not configured]", {
        name,
        contact,
        service: serviceLabel,
        details,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] email send failed:", err);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 502 },
    );
  }
}
