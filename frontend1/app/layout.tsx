import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono, Lato, Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Providers from "./Providers";
import AppLayout from "./components/route/AppLayout";
import { SITE } from "./config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Briefcasse - Trademark Registration & Legal Services India",
    template: "%s | Briefcasse",
  },
  description:
    "Register your trademark easily with Briefcasse. Expert legal services for startups & businesses in India. Fast, affordable & reliable support.",
  keywords: [
    "Briefcasse",
    "Briefcasse legal services",
    "Briefcasse trademark",
    "trademark registration India",
    "trademark registration online",
    "trademark registration Chennai",
    "startup registration India",
    "company registration India",
    "GST registration India",
    "legal services India",
    "legal services Chennai",
    "MCA compliance India",
    "copyright registration India",
    "patent registration India",
    "trademark registration for startups India",
    "affordable trademark registration India",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "Briefcasse - Trademark Registration & Legal Services India",
    description:
      "Easy trademark registration & legal services for startups in India. Register your brand with expert support. Fast & affordable.",
    images: [
      {
        url: SITE.logo,
        width: 1200,
        height: 630,
        alt: "Briefcasse - Trademark & Legal Services India",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Briefcasse - Trademark Registration & Legal Services India",
    description: "Easy trademark registration & legal services for startups in India.",
    images: [SITE.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: SITE.logo,
    shortcut: SITE.logo,
    apple: SITE.logo,
  },
  verification: {
    google: "6Eaqre6zKjZGrxKLDto8Ryah9pmSCQy-vEsSYPeqNjA",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  description:
    "Briefcasse is a Chennai-based legal services platform for trademark, tax, compliance, startup registration, and business legal support.",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE.email,
    telephone: SITE.telephone,
    url: `${SITE.url}/user/contact`,
  },
  serviceType: [
    "Trademark Registration",
    "Startup Registration",
    "Intellectual Property",
    "Tax Filing",
    "MCA Compliance",
    "Legal Advisory",
  ],
  areaServed: "IN",
  priceRange: "INR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${anton.variable} ${poppins.variable} antialiased`}
      >
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <GoogleAnalytics gaId="G-ZFHD6QC9HK" />
      </body>
    </html>
  );
}
