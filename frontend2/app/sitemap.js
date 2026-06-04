import { API_BASE_URL, SITE } from "./config/site";
import { SERVICES } from "./config/services";
import { getCanonicalServiceSlug } from "./utils/serviceSlug";

const SITE_URL = SITE.url;
const API_URL = `${API_BASE_URL}/api`;

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/serviced", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/user/about", priority: 0.65, changeFrequency: "monthly" },
  { path: "/user/contact", priority: 0.65, changeFrequency: "monthly" },
];

async function fetchJson(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function sitemap() {
  const now = new Date();
  const [serviceData, blogData] = await Promise.all([
    fetchJson("/services"),
    fetchJson("/blogs"),
  ]);

  const services = Array.isArray(serviceData?.items) ? serviceData.items : SERVICES;
  const blogs = Array.isArray(blogData?.data)
    ? blogData.data
    : Array.isArray(blogData?.items)
    ? blogData.items
    : [];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...services
      .filter((service) => getCanonicalServiceSlug(service) && service?.status !== "Inactive")
      .map((service) => ({
        url: `${SITE_URL}/services/${getCanonicalServiceSlug(service)}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
        changeFrequency: "monthly",
        priority: 0.9,
      })),
    ...blogs
      .filter((blog) => blog?.slug)
      .map((blog) => ({
        url: `${SITE_URL}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      })),
  ];
}
