

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "https://brief-ewyr.onrender.com/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;




import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://brief-ewyr.onrender.com/api/:path*",
      },
    ];
  },

  // ✅ llms.txt correct content-type
  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
      // ✅ Security headers — SEO audit-ல் இதுவும் கேட்கும்
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;