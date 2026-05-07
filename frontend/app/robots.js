// // app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
         allow: [
          "/",
          "/user/contact",  
        ],
        disallow: [
           "/user/", 
          "/api/",      // API routes Google index வேண்டாம்
          "/login/",    // Login page
          "/store/",    // Internal store
        ],
      },
    ],
    sitemap: "https://briefcasse.com/sitemap.xml",
    // host: "https://briefcasse.com",
  };
}


