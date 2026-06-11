// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     // turbopack: true,
//   },
//   turbopack: {
//     root: __dirname, // set your project root explicitly
//   },
//   // add other config options here if any
// };

// export default nextConfig;


import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_API_BASE_URL || "https://brief-ewyr.onrender.coms";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
