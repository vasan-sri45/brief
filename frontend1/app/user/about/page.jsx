import React from 'react';
import AboutUs from "../../components/common/About";
import { SITE } from "../../config/site";

export const metadata = {
  title: "About Us",
  description:
    "Register your startup easily with Briefcasse. Get expert legal support for incorporation, trademark, and compliance services for new businesses in India.",
  keywords: [
    "startup registration India",
    "company registration",
    "startup incorporation",
    "legal services India",
    "new business registration",
    "Briefcasse startup",
  ],
  alternates: {
    canonical: "/user/about",
  },
  openGraph: {
    type: "website",
    title: "About Us | Briefcasse",
    description:
      "Register your startup easily with Briefcasse. Expert legal support for incorporation, trademark, and compliance services.",
    url: `${SITE.url}/user/about`,
    siteName: SITE.name,
    images: [
      {
        url: "/assets/brief_blue.webp",
        width: 1200,
        height: 630,
        alt: "About Briefcasse",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Briefcasse",
    description:
      "Register your startup easily with Briefcasse. Expert legal support for new businesses.",
    images: ["/assets/brief_blue.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return (
    <>
      <AboutUs />
    </>
  )
}

export default page
