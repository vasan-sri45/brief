"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const BlogCard = ({ blog }) => {
  const { user } = useAuth();
  const img =
    blog.documents?.[0]?.url ||
    "https://placehold.co/300x200?text=Blog";

  return (
    <div
      className="flex h-[360px] w-full min-w-[280px] max-w-[320px] flex-col rounded-3xl border border-blue-100 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
    >
      <img
        className="mb-3 h-[162px] w-full rounded-2xl object-cover"
        src={img}
        alt={blog.title}
      />

      <p className="text-[11px] text-gray-400 mb-1 font-bold tracking-wide">
        {new Date(blog.createdAt).toLocaleDateString("en-GB")}
      </p>

      <h3 className="mb-1 line-clamp-2 text-base font-bold leading-snug text-custom-blue">
        {blog.title}
      </h3>

      <p className="text-[11px] text-letter1 line-clamp-2 mb-2 font-bold tracking-wide">
        {blog.content?.[0]?.body?.slice(0, 80) ||
          blog.content?.slice(0, 80)}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <Link
          href={`/blogs/${blog.slug}`}
          className="text-[0.8rem] font-bold text-blue-600"
        >
          <span className="inline-flex items-center">
              Read More
              <ArrowRight className="ml-2 w-5 h-5" />
            </span>
        </Link>

        {user?.role === "admin" && (
          <Link
            href={`/admin/blog/edit/${blog._id}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <Pencil size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
