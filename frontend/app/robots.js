// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",      // API routes Google index வேண்டாம்
          "/user/",     // User private pages
          "/login/",    // Login page
          "/store/",    // Internal store
        ],
      },
    ],
    sitemap: "https://briefcasse.com/sitemap.xml",
    host: "https://briefcasse.com",
  };
}