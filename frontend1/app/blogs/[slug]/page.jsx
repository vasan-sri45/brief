

import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }) {
  try {
    // ✅ Direct backend fetch — server side
    const res = await fetch(
      `https://brief-ewyr.onrender.com/api/blogs/${params.slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) return fallbackMetadata();

    const json = await res.json();
    const blog = json?.data;

    if (!blog) return fallbackMetadata();

    // ✅ Blog cover image
    const coverImage = blog.documents?.[0]?.url || "/assets/brief_blue.png";

    // ✅ Blog content — first block body preview as description
    let description = blog.subtitle || "";
    if (!description && Array.isArray(blog.content)) {
      description = blog.content?.[0]?.body?.slice(0, 160) || "";
    }

    return {
      // ✅ ஒவ்வொரு blog-க்கும் தனி title
      title: blog.title
        ? `${blog.title} | Briefcasse Blog`
        : "Legal Blog | Briefcasse",

      description:
        description ||
        "Read the latest legal insights and articles from Briefcasse on trademark, startup, tax filing and more.",

      alternates: {
        canonical: `/blogs/${params.slug}`,
      },

      // ✅ Open Graph — WhatsApp share-ல் blog image + title தெரியும்
      openGraph: {
        type: "article",
        title: blog.title || "Legal Blog | Briefcasse",
        description:
          description ||
          "Read the latest legal insights from Briefcasse.",
        url: `https://www.briefcasse.com/blogs/${params.slug}`,
        siteName: "Briefcasse",
        images: [
          {
            url: coverImage,   // ✅ Blog-ன் actual cover image
            width: 1200,
            height: 630,
            alt: blog.title || "Briefcasse Blog",
          },
        ],
        locale: "en_IN",
        publishedTime: blog.createdAt,
      },

      // ✅ Twitter Card
      twitter: {
        card: "summary_large_image",
        title: blog.title || "Legal Blog | Briefcasse",
        description:
          description ||
          "Read the latest legal insights from Briefcasse.",
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
    title: "Legal Blog | Briefcasse",
    description:
      "Read the latest legal insights and articles from Briefcasse on trademark, startup, tax filing and more.",
    openGraph: {
      title: "Legal Blog | Briefcasse",
      images: [{ url: "/assets/brief_blue.png" }],
    },
  };
}

export default function BlogDetailPage({ params }) {
  return <BlogDetailClient />;
}