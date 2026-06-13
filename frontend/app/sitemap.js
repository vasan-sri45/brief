import { SITE } from "./config/site";
import { SERVICES } from "./config/services";
import { getCanonicalServiceSlug } from "./utils/serviceSlug";

const SITE_URL = SITE.url;

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/serviced", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
  { path: "/user/about", priority: 0.65, changeFrequency: "monthly" },
  { path: "/user/contact", priority: 0.65, changeFrequency: "monthly" },
];

export default async function sitemap() {
  const now = new Date();
  const services = SERVICES;

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
  ];
}
