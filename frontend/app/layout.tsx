import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato, Anton, Poppins } from "next/font/google";
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

  authors: [{ name: "Briefcasse", url: "https://www.briefcasse.com" }],
  creator: "Briefcasse",
  publisher: "Briefcasse",

  metadataBase: new URL("https://www.briefcasse.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://www.briefcasse.com",
    siteName: "Briefcasse",
    title: "Briefcasse — Trademark & Legal Services",
    description:
      "Easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses. Secure your brand with expert support.",
    images: [
      {
        url: "/assets/brief_blue.png", 
        width: 1906,
        height: 1450,
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
    images: ["/assets/brief_blue.png"], // ✅ உங்கள் actual logo path
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
    icon: "/assets/brief_blue.png",       // ✅ Browser tab icon
    shortcut: "/assets/brief_blue.png",   // ✅ Shortcut icon
    apple: "/assets/brief_blue.png",      // ✅ iPhone home screen icon
  },

  verification: {
    google: "6Eaqre6zKjZGrxKLDto8Ryah9pmSCQy-vEsSYPeqNjA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} ${anton.variable} ${poppins.variable}antialiased`}>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}


