import BlogDetailClient from "./BlogDetailClient";
import { SITE } from "../../config/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return fallbackMetadata(slug);
}

function fallbackMetadata(slug = "") {
  return {
    title: "Legal Blog",
    description:
      "Read the latest legal insights and articles from Briefcasse on trademark, startup, tax filing and more.",
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: `Legal Blog | ${SITE.name}`,
      url: `${SITE.url}/blogs/${slug}`,
      images: [{ url: "/assets/brief_blue.webp" }],
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
