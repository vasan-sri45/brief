import ServicedClient from "./ServiceClient";

export const metadata = {
  title: "Our Legal Services",
  description:
    "Explore Briefcasse's complete range of legal services — Startup Registration, Trademark, Tax Filing, MCA Compliance, Legal Advisory and more. Expert support for businesses in India.",
  keywords: [
    "legal services India",
    "startup registration",
    "trademark registration",
    "tax filing",
    "MCA compliance",
    "legal advisory",
    "intellectual property",
    "Briefcasse services",
  ],
  alternates: {
    canonical: "/serviced",
  },
  openGraph: {
    type: "website",
    title: "Our Legal Services | Briefcasse",
    description:
      "Startup Registration, Trademark, Tax Filing, MCA Compliance, Legal Advisory and more — all in one place at Briefcasse.",
    url: "https://www.briefcasse.com/serviced",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.webp",
        width: 1200,
        height: 630,
        alt: "Briefcasse Legal Services",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Legal Services | Briefcasse",
    description:
      "Startup, Trademark, Tax Filing, MCA Compliance and more — expert legal services by Briefcasse.",
    images: ["/assets/brief_blue.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServicedPage() {
  return <ServicedClient />;
}
