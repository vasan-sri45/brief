// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // turbopack: true,
  },
  turbopack: {
    root: __dirname, // set your project root explicitly
  },
  // add other config options here if any
};

export default nextConfig;
