import React from 'react'
import Contact from "../../components/common/Contact";

export const metadata = {
  title: "Contact Us | Briefcasse",
  description:
    "Get in touch with Briefcasse for trademark registration, legal services, and business support. Our experts are ready to help your startup succeed.",
  keywords: [
    "contact Briefcasse",
    "trademark help",
    "legal support India",
    "business registration enquiry",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    title: "Contact Us | Briefcasse",
    description:
      "Reach out to Briefcasse for trademark registration and legal services. Expert support for startups and businesses in India.",
    url: "https://www.briefcasse.com/contact",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.png",
        width: 1200,
        height: 630,
        alt: "Contact Briefcasse",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Briefcasse",
    description:
      "Reach out to Briefcasse for trademark registration and legal services.",
    images: ["/assets/brief_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


const page = () => {
  return (
    <div>
      <Contact />
    </div>
  )
}

export default page
