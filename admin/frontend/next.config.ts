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

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "https://brief-ewyr.onrender.com/api/:path*",
        destination:"http://localhost:4500/api/:path*",
      },
    ];
  },
};

export default nextConfig;

