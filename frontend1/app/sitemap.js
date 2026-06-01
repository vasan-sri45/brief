export default async function sitemap() {

   let serviceUrls = [];
   let blogUrls = [];

  try {
    const res = await fetch(
      "https://brief-ewyr.onrender.com/api/services",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    serviceUrls = (data?.items || []).map((s) => ({
      url: `https://briefcasse.com/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, 
    }));
  } catch {
    serviceUrls = [];
  }

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