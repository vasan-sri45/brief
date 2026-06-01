"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getBlogCover, getBlogExcerpt } from "../../utils/blogContent";

const LatestBlogCard = ({ blog }) => {
  const excerpt = getBlogExcerpt(blog);

  return (
    <section>
      <div className="text-start">
        <h2 className="font-anton text-[1rem] font-normal tracking-wide text-custom-blue md:text-[1.1rem] lg:text-[1.3rem]">
          Latest Blog
        </h2>

        <div className="mb-3 flex justify-start overflow-hidden">
          <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
            <span className="absolute inset-0 rounded-full bg-white/70" />
          </span>
        </div>
      </div>

      <article className="w-full overflow-hidden rounded-3xl border border-blue-500 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="flex h-full flex-col p-1">
          <Link
            href={`/blogs/${blog.slug}`}
            className="relative mb-4 block h-[220px] shrink-0 overflow-hidden rounded-2xl border-2 border-blue-500 bg-slate-100 md:h-[320px] lg:h-[390px]"
          >
            <Image
              src={getBlogCover(blog)}
              alt={blog.title || "Briefcasse blog image"}
              fill
              className="object-cover transition duration-500 hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </Link>

          <div className="flex flex-1 flex-col">
            <h3 className="mb-2 text-xl font-extrabold leading-snug text-custom-blue md:text-2xl">
              {blog.title}
            </h3>

            {blog.tags?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {blog.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mb-4 line-clamp-3 text-sm font-bold leading-relaxed text-letter1 md:text-base">
              {excerpt}
              {excerpt?.length >= 170 ? "..." : ""}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <p className="text-sm font-bold text-slate-400">
                {new Date(blog.createdAt).toLocaleDateString("en-IN")}
              </p>

              <Link
                href={`/blogs/${blog.slug}`}
                className="inline-flex items-center text-sm font-bold text-starttext hover:text-blue-700"
              >
                Read More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default LatestBlogCard;
