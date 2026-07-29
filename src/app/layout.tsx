import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bavestudio.com"),
  title: {
    default: "Bave Studio — Photography, Videography & Live Streaming",
    template: "%s — Bave Studio",
  },
  description:
    "Professional photography, videography and live streaming for events, weddings, corporate and commercial clients.",
  openGraph: {
    siteName: "Bave Studio",
    type: "website",
  },
};

/* LocalBusiness structured data — service area + geo details to be confirmed
   with the client (open questions #3 in the scope doc). */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Bave Studio",
  description:
    "Photography, videography and live streaming for events, weddings, corporate and commercial clients.",
  telephone: "+254798108543",
  email: "studiobave9@gmail.com",
  url: "https://bavestudio.com",
  areaServed: "Kenya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Blocking script, runs before paint — sets the theme a visitor
            already chose so there's no flash of the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
