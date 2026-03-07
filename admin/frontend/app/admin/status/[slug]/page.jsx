"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import {ArrowRight} from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        return res.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!slug,
  });

  if (isLoading)
    return <div className="py-20 text-center font-medium">Loading blog...</div>;

  if (isError || !data)
    return <div className="py-20 text-center text-gray-500">Blog not found</div>;

  const blog = data;
  const cover = blog.documents?.[0]?.url || "/placeholder.png";
  const date = new Date(blog.createdAt).toLocaleDateString("en-GB");

  // ✨ SAFE NORMALIZATION
  let contentBlocks = [];
  try {
    if (Array.isArray(blog.content)) {
      contentBlocks = blog.content;
    } else if (typeof blog.content === "string") {
      const parsed = JSON.parse(blog.content);
      contentBlocks = Array.isArray(parsed)
        ? parsed
        : [{ heading: "", body: parsed }];
    }
  } catch {
    contentBlocks = [{ heading: "", body: String(blog.content) }];
  }

  return (
    <main className="w-full py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-anton font-normal text-[1.2rem] md:text-[1.8rem] text-custom-blue mb-3 uppercase text-center tracking-wide">
          {blog.title}
        </h1>

        {blog.subtitle && (
          <p className="text-center text-[1rem] md:text-[1.2rem] text-letter1 mb-6 font-lato font-bold">
            {blog.subtitle}
          </p>
        )}

        <img
          className="w-full h-[220px] md:h-[450px] object-cover mb-4 shadow"
          src={cover}
          alt={blog.title}
        />

        <p className="text-[0.7rem] md:text-[0.8rem] text-gray-500 mb-4 font-bold">
          {date}
        </p>

        <article className="text-[13px] leading-6 space-y-6 text-justify">
          {contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => (
              <div key={index}>
                {block.heading && (
                  <h3 className="text-[1rem] md:text-[1.4rem] text-custom-blue mb-2 font-lato font-bold tracking-wide">
                    {block.heading}
                  </h3>
                )}

                <div className="font-lato font-bold text-letter1 text-[0.8rem] md:text-[0.9rem] leading-relaxed tracking-wide space-y-2">
                  {block.body
                    ?.split(".")
                    .filter(Boolean)
                    .map((sentence, i) => (
                      <p key={i}>{sentence.trim()}.</p>
                    ))}
              </div>
              </div>
            ))
          ) : (
            <p>No content available</p>
          )}
        </article>

        <div className="flex justify-end mt-12">
           <Link
              href={`/blogs`}
              className="bg-starttext text-white text-[0.9rem] md:text-[1.1rem] font-anton font-normal tracking-wide rounded-full flex justify-center items-center px-3 py-2"
            >
              Back to blogs
              <ArrowRight className="ml-2 w-5 h-5 md:w-7 md:h-7" />
            </Link>
        </div>
      </div>
    </main>
  );
}
