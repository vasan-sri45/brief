import React from 'react';
import StartUpPackage from "../components/services/StartUpPackage";

export const metadata = {
  title: "Startup Registration | Briefcasse",
  description:
    "Register your startup easily with Briefcasse. Get expert legal support for incorporation, trademark, and compliance services for new businesses.",
  alternates: {
    canonical: "/startup",
  },
  openGraph: {
    type: "website",
    title: "Startup Registration | Briefcasse",
    description:
      "Register your startup easily with Briefcasse. Expert legal support for incorporation and trademark services.",
    url: "https://www.briefcasse.com/startup",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.png",
        width: 1200,
        height: 630,
        alt: "Briefcasse Startup Registration",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Registration | Briefcasse",
    description:
      "Register your startup easily with Briefcasse. Expert legal support.",
    images: ["/assets/brief_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


const page = () => {
  return (
    <>
      <StartUpPackage />
    </>
  )
}

export default page