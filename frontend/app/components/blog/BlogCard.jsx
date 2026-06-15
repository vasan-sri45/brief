"use client";
import React from "react";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

const BlogCard = ({ blog }) => {
  const img =
    blog.documents?.[0]?.url ||
    "https://placehold.co/300x200?text=Blog";

  return (
    <div
      className="
        w-full
        min-w-[280px]
        max-w-[300px]
        h-[360px]
        bg-white
        border-2 border-custom-blue
        rounded-lg
        shadow-md
        p-3
        flex flex-col
      "
    >
      <img
        className="w-full h-[162px] rounded-md mb-2 object-cover"
        src={img}
        alt={blog.title}
      />

      <p className="text-[11px] text-gray-400 mb-1 font-bold tracking-wide">
        {new Date(blog.createdAt).toLocaleDateString("en-GB")}
      </p>

      <h3 className="text-custom-blue font-anton font-normal text-[13px] leading-snug mb-1 line-clamp-2 tracking-wide">
        {blog.title}
      </h3>

      <p className="text-[11px] text-letter1 line-clamp-2 mb-2 font-bold tracking-wide">
        {blog.content?.[0]?.body?.slice(0, 80) ||
          blog.content?.slice(0, 80)}
      </p>

      <div className="mt-auto">
        <Link
          href={`/blogs/${blog.slug}`}
          className="text-[0.8rem] text-starttext font-anton font-normal tracking-wide"
        >
          <button
              className="mt-6 inline-flex items-center"
            >
              Read More
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
