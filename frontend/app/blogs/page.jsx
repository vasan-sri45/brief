
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Legal Blogs & Articles",
  description:
    "Read the latest legal blogs and articles on trademark registration, startup incorporation, tax filing, MCA compliance, and more. Stay informed with Briefcasse.",
  keywords: [
    "legal blogs India",
    "trademark articles",
    "startup legal tips",
    "tax filing guide",
    "MCA compliance blog",
    "business law India",
    "Briefcasse blog",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    type: "website",
    title: "Legal Blogs & Articles | Briefcasse",
    description:
      "Latest legal insights on trademark, startup, tax filing, and MCA compliance. Stay informed with Briefcasse expert articles.",
    url: "https://www.briefcasse.com/blogs",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.png",
        width: 1200,
        height: 630,
        alt: "Briefcasse Legal Blogs",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Blogs & Articles | Briefcasse",
    description:
      "Latest legal insights on trademark, startup, tax filing and more by Briefcasse.",
    images: ["/assets/brief_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
