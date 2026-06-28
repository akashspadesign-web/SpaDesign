import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import LenisProvider from "@/components/providers/LenisProvider";
import ChromeGate from "@/components/providers/ChromeGate";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/footer/Footer";

// Archivo for display — neutral geometric sans, reads like a real
// architecture-firm site. The Tailwind class is still `font-serif` for
// minimal disruption; the underlying font is now Archivo.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName}, Architects · Engineers · Interiors`,
    template: `%s, ${site.name}`,
  },
  description: site.description,
  keywords: [
    "architecture firm Noida",
    "interior design",
    "structural engineering",
    "landscape architecture",
    "SPA Design Consultants",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.legalName,
    title: `${site.legalName}. Renovate Your Imaginations`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="bg-bg font-sans text-body text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wide focus:text-bg"
        >
          Skip to content
        </a>
        <LenisProvider>
          <ChromeGate nav={<Nav />} footer={<Footer />}>
            <main id="main">{children}</main>
          </ChromeGate>
        </LenisProvider>
      </body>
    </html>
  );
}
