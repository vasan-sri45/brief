
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
        ],
      },
    ],
    sitemap: "https://briefcasse.com/sitemap.xml",
    host: "https://briefcasse.com",
  };
}


