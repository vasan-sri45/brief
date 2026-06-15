import { SERVICES } from "./config/services";

export default async function sitemap() {

   let blogUrls = [];

  const serviceUrls = SERVICES.map((service) => ({
    url: `https://briefcasse.com/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

   // Blogs
  try {
    const res = await fetch(
      "https://brief-ewyr.onrender.com/api/blogs",
      {
        next: { revalidate: 3600 },
      }
    );

    const data = await res.json();

    blogUrls = (data?.items || []).map((blog) => ({
      url: `https://briefcasse.com/blogs/${blog.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    blogUrls = [];
  }

  return [
    {
      url: "https://briefcasse.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://briefcasse.com/serviced",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://briefcasse.com/blogs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://briefcasse.com/startup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://briefcasse.com/user/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...serviceUrls,
    ...blogUrls,
  ];
}
