
// "use client";
// import { useState } from "react";
// import LatestBlogCard from "../components/blog/LatestBlog";
// import TopReadBlogs from "../components/blog/TopreadBlog";
// import BlogInfiniteSlider from "../components/blog/BlogInfiniteSlider";
// import { useGetBlogs } from "../hooks/useBlogMutation";

// export default function BlogPage() {
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError } = useGetBlogs(page, 10);

//   const blogs = Array.isArray(data?.data) ? data.data : [];
//   const totalPages = data?.meta?.totalPages ?? 1;
//   const currentPage = data?.meta?.page ?? page;

//   const latestBlog = blogs[0] || null;
//   const topReadBlogs = blogs.slice(1, 6);
//   const sliderBlogs = blogs.slice(6);

//   if (isLoading) return <div className="p-4">Loading blogs...</div>;
//   if (isError) return <div className="p-4 text-red-500">Failed to load blogs</div>;

//   return (
//     <section className="w-full pt-4 pb-3 lg:pt-12">
//       <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//           <div className="md:col-span-2">
//             {latestBlog ? <LatestBlogCard blog={latestBlog} /> : <p>No blogs found.</p>}
//           </div>
//           <div>
//             <TopReadBlogs blogs={topReadBlogs} />
//           </div>
//         </div>

//         <div className="mt-8">
//           <BlogInfiniteSlider blogs={sliderBlogs} />
//         </div>

//         {currentPage < totalPages && (
//           <div className="flex justify-center mt-8">
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-6 py-2 rounded-full bg-[#E3A849] text-black shadow hover:shadow-lg hover:scale-105 transition"
//             >
//               View More Blogs →
//             </button>
//           </div>
//         )}
//       </main>
//     </section>
//   );
// }


// app/blogs/page.jsx
// ⚠️ "use client" வேண்டாம்!

import BlogClient from "./BlogClient";

export const metadata = {
  title: "Legal Blogs & Articles | Briefcasse",
  description:
    "Read the latest legal blogs and articles on trademark registration, startup incorporation, tax filing, MCA compliance, and more. Stay informed with Briefcasse.",
  keywords: [
    "legal blogs India",
    "trademark articles",
    "startup legal tips",
    "tax filing guide",
    "MCA compliance blog",
    "business law India",
    "Briefcasse blog",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    type: "website",
    title: "Legal Blogs & Articles | Briefcasse",
    description:
      "Latest legal insights on trademark, startup, tax filing, and MCA compliance. Stay informed with Briefcasse expert articles.",
    url: "https://www.briefcasse.com/blogs",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.png",
        width: 1200,
        height: 630,
        alt: "Briefcasse Legal Blogs",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Blogs & Articles | Briefcasse",
    description:
      "Latest legal insights on trademark, startup, tax filing and more by Briefcasse.",
    images: ["/assets/brief_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogClient />;
}