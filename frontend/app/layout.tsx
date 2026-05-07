import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato, Anton, Poppins } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";
import Providers from "./Providers";
import AppLayout from "./components/route/AppLayout";

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
    default: "Briefcasse — Trademark & Legal Services",
    template: "%s | Briefcasse",
  },
  description:
    "Briefcasse offers easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses. Secure your brand with expert support.",

  keywords: [
    "trademark registration",
    "legal services",
    "brand protection",
    "startup legal help",
    "trademark filing India",
    "intellectual property",
    "Briefcasse",
  ],

  authors: [{ name: "Briefcasse", url: "https://briefcasse.com" }],
  creator: "Briefcasse",
  publisher: "Briefcasse",

  metadataBase: new URL("https://briefcasse.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://briefcasse.com",
    siteName: "Briefcasse",
    title: "Briefcasse — Trademark & Legal Services",
    description:
      "Easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses. Secure your brand with expert support.",
    images: [
      {
        url: "/assets/brief_blue.png", 
        width: 1200,
        height: 630,
        alt: "Briefcasse Logo — Trademark & Legal Services",
      },
    ],
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Briefcasse — Trademark & Legal Services",
    description:
      "Easy and reliable trademark registration and legal services for startups and businesses.",
    images: ["/assets/brief_blue.png"], 
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
    icon: "/assets/brief_blue.png",       
    shortcut: "/assets/brief_blue.png",  
    apple: "/assets/brief_blue.png",      
  },

  verification: {
    google: "6Eaqre6zKjZGrxKLDto8Ryah9pmSCQy-vEsSYPeqNjA",
  },
};


const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Briefcasse",
  "url": "https://briefcasse.com",
  "logo": "https://briefcasse.com/assets/brief_blue.png",
  "description":
    "Briefcasse offers easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses in India.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://briefcasse.com/contact"
  },
  "serviceType": [
    "Trademark Registration",
    "Startup Registration",
    "Intellectual Property",
    "Tax Filing",
    "MCA Compliance",
    "Legal Advisory"
  ],
  "areaServed": "IN",
  "priceRange": "₹₹"
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${anton.variable} ${poppins.variable}antialiased`}>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
         <GoogleAnalytics gaId="G-ZFHD6QC9HK" />
      </body>
    </html>
  );
}


