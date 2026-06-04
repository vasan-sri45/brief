import BlogDetailClient from "./BlogDetailClient";
import { API_BASE_URL, SITE } from "../../config/site";
import { getBlogCover, getBlogExcerpt } from "../../utils/blogContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return fallbackMetadata();

    const json = await res.json();
    const blog = json?.data;

    if (!blog) return fallbackMetadata();

    const coverImage = getBlogCover(blog);
    const description =
      getBlogExcerpt(blog, 160) ||
      "Read the latest legal insights from Briefcasse.";
    const title = blog.metaTitle || blog.title || "Legal Blog";

    return {
      title,
      description,
      alternates: {
        canonical: `/blogs/${slug}`,
      },
      openGraph: {
        type: "article",
        title,
        description,
        url: `${SITE.url}/blogs/${slug}`,
        siteName: SITE.name,
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: blog.title || `${SITE.name} Blog`,
          },
        ],
        locale: "en_IN",
        publishedTime: blog.createdAt,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [coverImage],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return fallbackMetadata();
  }
}

function fallbackMetadata() {
  return {
    title: "Legal Blog",
    description:
      "Read the latest legal insights and articles from Briefcasse on trademark, startup, tax filing and more.",
    openGraph: {
      title: `Legal Blog | ${SITE.name}`,
      images: [{ url: "/assets/brief_blue.png" }],
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
