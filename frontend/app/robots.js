// // app/robots.js
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
    // host: "https://briefcasse.com",
  };
}


// app/robots.js
// export default function robots() {
//   return {
//     rules: [
//       {
//         userAgent: "*",
//         allow: [
//           "/",
//           "/user/contact", // ✅ Contact page allow
//         ],
//         disallow: [
//           "/api/",
//           "/user/",    // General user pages block
//           "/login/",
//           "/store/",
//         ],
//       },
//     ],
//     sitemap: "https://briefcasse.com/sitemap.xml",
//   };
// }