// "use client";
// import LatestBlogCard from "../components/blog/LatestBlog";
// import TopReadBlogs from "../components/blog/TopreadBlog";
// import BlogInfiniteSlider from "../components/blog/BlogInfiniteSlider";
// import { useGetBlogs } from "../hooks/useBlogMutation";

// export default function BlogPage() {
//   const { data, isLoading, isError } = useGetBlogs(1, 10);

//   // FIX: data IS the blog array
//   const blogs = Array.isArray(data) ? data : [];

//   // 🧠 latest = first blog
//   const latestBlog = blogs[0];

//   // 📌 top read = next 5
//   const topReadBlogs = blogs.slice(1, 6);

//   // 🎞 slider = all remaining
//   const sliderBlogs = blogs.slice(6);

//   if (isLoading) return <p className="p-4">Loading blogs...</p>;
//   if (isError) return <p className="p-4 text-red-500">Failed to load blogs</p>;

//   return (
//     <section className="w-full pt-4 pb-3 lg:pt-12">
//       <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//           {/* Left: Latest Blog */}
//           <div className="md:col-span-2">
//             {latestBlog ? (
//               <LatestBlogCard blog={latestBlog} />
//             ) : (
//               <p>No blogs found.</p>
//             )}
//           </div>

//           {/* Right: Top Reads */}
//           <div>
//             <TopReadBlogs blogs={topReadBlogs} />
//           </div>
//         </div>

//         <div className="mt-8">
//           <BlogInfiniteSlider blogs={sliderBlogs} />
//         </div>

//       </main>
//     </section>
//   );
// }


// "use client";

// import { useState } from "react";
// import LatestBlogCard from "../components/blog/LatestBlog";
// import TopReadBlogs from "../components/blog/TopreadBlog";
// import BlogInfiniteSlider from "../components/blog/BlogInfiniteSlider";
// import { useGetBlogs } from "../hooks/useBlogMutation";
// import Link from "next/link";

// export default function BlogPage() {
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError } = useGetBlogs(page, 10);

//   const blogs = Array.isArray(data?.data) ? data.data : [];

//   const latestBlog = blogs[0];
//   const topReadBlogs = blogs.slice(1, 6);
//   const sliderBlogs = blogs.slice(6);
//   console.log(latestBlog)

//   if (isLoading) return <p className="p-4">Loading blogs...</p>;
//   if (isError) return <p className="p-4 text-red-500">Failed to load blogs</p>;

//   return (
//     <section className="w-full pt-4 pb-3 lg:pt-12">
//       <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">

//         {/* GRID - Latest + Top Reads */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//           <div className="md:col-span-2">
//             {latestBlog ? (
//               <LatestBlogCard blog={latestBlog} />
//             ) : (
//               <p>No blogs found.</p>
//             )}
//           </div>

//           <div>
//             <TopReadBlogs blogs={topReadBlogs} />
//           </div>
//         </div>

//         {/* SLIDER */}
//         {sliderBlogs.length > 0 && (
//           <div className="mt-8">
//             <BlogInfiniteSlider blogs={sliderBlogs} />
//           </div>
//         )}

//         {/* PAGINATION — VIEW MORE */}
//         {data?.meta?.total > page * 10 && (
//           <div className="w-full flex justify-center mt-6">
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-6 py-2 rounded-full bg-[#E3A849] text-white shadow hover:shadow-lg hover:scale-105 transition"
//             >
//               View More Blogs →
//             </button>
//           </div>
//         )}

//       </main>
//     </section>
//   );
// }


// "use client";
// import { useState } from "react";
// import LatestBlogCard from "../components/blog/LatestBlog";
// import TopReadBlogs from "../components/blog/TopreadBlog";
// import BlogInfiniteSlider from "../components/blog/BlogInfiniteSlider";
// import { useGetBlogs } from "../hooks/useBlogMutation";

// export default function BlogPage() {
//   const [page, setPage] = useState(1);
//   const { data, isLoading, isError } = useGetBlogs(page, 10);
//   console.log(data)

//   const blogs = Array.isArray(data?.data) ? data.data : [];
//   const total = data?.meta?.total || 0;

//   const latestBlog = blogs[0];
//   const topReadBlogs = blogs.slice(1, 6);
//   const sliderBlogs = blogs.slice(6);

//   if (isLoading) return <p className="p-4">Loading blogs...</p>;
//   if (isError) return <p className="p-4 text-red-500">Failed to load blogs</p>;

//   return (
//     <section className="w-full pt-4 pb-3 lg:pt-12">
//       <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//           <div className="md:col-span-2">
//             {latestBlog ? (
//               <LatestBlogCard blog={latestBlog} />
//             ) : (
//               <p>No blogs found.</p>
//             )}
//           </div>

//           <div>
//             {topReadBlogs.length > 0 ? (
//               <TopReadBlogs blogs={topReadBlogs} />
//             ) : (
//               <p className="text-gray-500 text-center mt-4">
//                 No blogs available yet.
//               </p>
//             )}
//           </div>
//         </div>

//         {sliderBlogs.length > 0 && (
//           <div className="mt-8">
//             <BlogInfiniteSlider blogs={sliderBlogs} />
//           </div>
//         )}

//         {total > page * 10 && (
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-6 py-2 rounded-full bg-[#E3A849] text-white shadow hover:shadow-lg hover:scale-105 transition"
//             >
//               View More Blogs →
//             </button>
//           </div>
//         )}
//       </main>
//     </section>
//   );
// }


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

//   const totalPages = data?.meta?.totalPages || 1;
//   const currentPage = data?.meta?.page || page;

//   const latestBlog = blogs[0];
//   const topReadBlogs = blogs.slice(1, 6);
//   const sliderBlogs = blogs.slice(6);

//   if (isLoading) return <p className="p-4">Loading blogs...</p>;
//   if (isError) return <p className="p-4 text-red-500">Failed to load blogs</p>;

//   return (
//     <section className="w-full pt-4 pb-3 lg:pt-12">
//       <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">

//         {/* Latest + Top Read */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
//           <div className="md:col-span-2">
//             {latestBlog ? (
//               <LatestBlogCard blog={latestBlog} />
//             ) : (
//               <p>No blogs found.</p>
//             )}
//           </div>
//           <div>
//             <TopReadBlogs blogs={topReadBlogs} />
//           </div>
//         </div>

//         {/* Slider */}
//         {sliderBlogs.length > 0 && (
//           <div className="mt-8">
//             <BlogInfiniteSlider blogs={sliderBlogs} />
//           </div>
//         )}

//         {/* Pagination Button */}
//         {currentPage < totalPages && (
//           <div className="flex justify-center mt-8">
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-6 py-2 rounded-full bg-[#E3A849] text-white shadow hover:shadow-lg hover:scale-105 transition"
//             >
//               View More Blogs →
//             </button>
//           </div>
//         )}
//       </main>
//     </section>
//   );
// }



"use client";
import { useState } from "react";
import LatestBlogCard from "../components/blog/LatestBlog";
import TopReadBlogs from "../components/blog/TopreadBlog";
import BlogInfiniteSlider from "../components/blog/BlogInfiniteSlider";
import { useGetBlogs } from "../hooks/useBlogMutation";

export default function BlogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetBlogs(page, 10);

  const blogs = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? page;

  const latestBlog = blogs[0] || null;
  const topReadBlogs = blogs.slice(1, 6);
  const sliderBlogs = blogs.slice(6);

  if (isLoading) return <div className="p-4">Loading blogs...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load blogs</div>;

  return (
    <section className="w-full pt-4 pb-3 lg:pt-12">
      <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          <div className="md:col-span-2">
            {latestBlog ? <LatestBlogCard blog={latestBlog} /> : <p>No blogs found.</p>}
          </div>
          <div>
            <TopReadBlogs blogs={topReadBlogs} />
          </div>
        </div>

        <div className="mt-8">
          <BlogInfiniteSlider blogs={sliderBlogs} />
        </div>

        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-2 rounded-full bg-[#E3A849] text-black shadow hover:shadow-lg hover:scale-105 transition"
            >
              View More Blogs →
            </button>
          </div>
        )}
      </main>
    </section>
  );
}
