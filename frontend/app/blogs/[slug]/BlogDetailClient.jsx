"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import { ArrowLeft, CalendarDays } from "lucide-react";
import {
  getBlogCover,
  getBlogExcerpt,
  normalizeBlogContent,
} from "../../utils/blogContent";
import { SITE } from "../../config/site";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] bg-slate-50 py-20 text-center font-bold text-slate-600">
        Loading blog...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[50vh] bg-slate-50 py-20 text-center font-bold text-slate-500">
        Blog not found
      </div>
    );
  }

  const blog = data;
  const cover = getBlogCover(blog);
  const contentBlocks = normalizeBlogContent(blog.content);
  const description = getBlogExcerpt(blog, 160);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description,
    image: cover,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Organization",
      name: "Briefcasse",
    },
    publisher: {
      "@type": "Organization",
      name: "Briefcasse",
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/assets/brief_blue.png`,
      },
    },
    mainEntityOfPage: `${SITE.url}/blogs/${blog.slug}`,
  };

  const backToPrevious = () => {
    if (window.history.length > 1) router.back();
    else router.replace("/blogs");
  };

  return (
    <main className="w-full bg-slate-50 px-4 py-8 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="mx-auto max-w-5xl">
        <header className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            Briefcasse Guide
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-600">
              {blog.subtitle}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-500">
            <CalendarDays size={18} />
            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        <div className="relative mt-6 h-[260px] overflow-hidden rounded-[28px] border border-blue-100 bg-blue-50 shadow-sm md:h-[520px]">
          <Image
            src={cover}
            alt={blog.title || "Briefcasse blog cover"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 960px"
            priority
          />
        </div>

        <section className="mt-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm md:p-9">
          <div className="prose prose-slate max-w-none">
            {contentBlocks.length > 0 ? (
              contentBlocks.map((block, index) => (
                <section key={index} className="mb-8 last:mb-0">
                  {block.heading && (
                    <h2 className="mb-3 text-2xl font-black text-slate-950">
                      {block.heading}
                    </h2>
                  )}

                  <div className="space-y-4 text-base font-medium leading-8 text-slate-700">
                    {String(block.body || "")
                      .split(".")
                      .map((sentence) => sentence.trim())
                      .filter(Boolean)
                      .map((sentence, i) => (
                        <p key={i}>{sentence}.</p>
                      ))}
                  </div>
                </section>
              ))
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </section>

        <div className="mt-8 flex justify-start">
          <button
            onClick={backToPrevious}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to blogs
          </button>
        </div>
      </article>
    </main>
  );
}
