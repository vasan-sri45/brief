// app/sitemap.js — புதிய file create செய்யுங்கள்

export default async function sitemap() {

   let serviceUrls = [];
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
      priority: 0.9, // ✅ High priority — main service pages
    }));
  } catch {
    serviceUrls = [];
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
    ...serviceUrls
  ];
}