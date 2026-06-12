"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/api";
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
    <main className="w-full bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mx-auto mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-700">
            Briefcasse Insights
          </p>
          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
          {blog.title}
          </h1>

          {blog.metaDescription && (
            <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
              {blog.metaDescription}
            </p>
          )}

          {blog.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {blog.subtitle && (
          <p className="text-center text-[1rem] md:text-[1.2rem] text-letter1 mb-6 font-lato font-bold">
            {blog.subtitle}
          </p>
        )}

        <div className="relative mb-5 h-[240px] w-full overflow-hidden rounded-3xl shadow-[0_18px_55px_rgba(15,23,42,0.12)] md:h-[520px]">
          <Image
            className="object-cover"
            src={cover}
            alt={blog.title || "Blog cover"}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            priority
          />
        </div>

        <p className="mb-6 text-sm font-bold text-slate-400">
          {date}
        </p>

        <article className="rounded-3xl bg-white p-5 text-base leading-8 text-slate-700 shadow-[0_14px_45px_rgba(15,23,42,0.06)] md:p-8">
          {contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => (
              <div key={index}>
                {block.heading && (
                  <h3 className="mb-3 text-xl font-extrabold text-slate-950 md:text-2xl">
                    {block.heading}
                  </h3>
                )}

                <div className="space-y-3 font-medium leading-8 text-slate-700">
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
              href={`/admin/status`}
              className="flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
            >
              Back to blogs
              <ArrowRight className="ml-2 w-5 h-5 md:w-7 md:h-7" />
            </Link>
        </div>
      </div>
    </main>
  );
}
