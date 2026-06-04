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
  const totalPages = data?.meta?.totalPages ?? data?.pagination?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? data?.pagination?.page ?? page;

  const latestBlog = blogs[0] || null;
  const topReadBlogs = blogs.slice(1, 6);
  const sliderBlogs = blogs.slice(6);

  if (isLoading) {
    return <div className="p-6 text-center font-bold text-slate-500">Loading blogs...</div>;
  }

  if (isError) {
    return <div className="p-6 text-center font-bold text-red-500">Failed to load blogs</div>;
  }

  return (
    <section className="w-full bg-slate-50 pt-4 pb-10 lg:pt-10">
      <main className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
        <h1 className="sr-only">
          Briefcasse legal blogs, trademark articles, startup registration guides and compliance updates
        </h1>

        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3">
          <div className="md:col-span-2">
            {latestBlog ? (
              <LatestBlogCard blog={latestBlog} />
            ) : (
              <p className="rounded-3xl border border-blue-100 bg-white p-8 text-center font-bold text-slate-500">
                No blogs found.
              </p>
            )}
          </div>

          <div>
            <TopReadBlogs blogs={topReadBlogs} />
          </div>
        </div>

        {sliderBlogs.length > 0 && (
          <div className="mt-8">
            <BlogInfiniteSlider blogs={sliderBlogs} />
          </div>
        )}

        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-full bg-[#E3A849] px-6 py-2 font-bold text-black shadow transition hover:scale-105 hover:shadow-lg"
            >
              View More Blogs
            </button>
          </div>
        )}
      </main>
    </section>
  );
}
