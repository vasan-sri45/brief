
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
