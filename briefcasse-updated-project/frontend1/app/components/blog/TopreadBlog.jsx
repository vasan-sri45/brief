"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TopReadBlogs = ({ blogs = [] }) => {
  return (
    <section>
      <div className="text-start">
        <h2 className="font-poppins text-[1rem] font-semibold text-custom-blue md:text-[1.1rem] lg:text-[1.3rem]">
          Top Read
        </h2>

        <div className="mb-3 flex justify-start overflow-hidden">
          <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
            <span className="absolute inset-0 rounded-full bg-white/70" />
          </span>
        </div>
      </div>

      <div className="w-full rounded-md">
        <div className="flex h-[350px] flex-col gap-4 overflow-y-auto pr-1 md:h-[450px] lg:h-[540px]">
          {blogs.map((blog) => {
            const thumb = blog.documents?.[0]?.url || "/assets/brief_banner1.png";
            const date = blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-IN")
              : "";

            return (
              <Link
                key={blog._id || blog.slug}
                href={`/blogs/${blog.slug}`}
                className="group flex gap-3 rounded-xl p-2 transition hover:bg-blue-50"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-custom-blue/70 bg-slate-100">
                  <Image
                    src={thumb}
                    alt={blog.title || "Blog thumbnail"}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="96px"
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col">
                  <h3 className="mb-2 line-clamp-2 font-anton text-[0.7rem] font-normal leading-snug tracking-wide text-custom-blue lg:text-[0.8rem]">
                    {blog.title}
                  </h3>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <p className="text-[0.7rem] font-bold text-gray-400 md:text-[0.8rem]">
                      {date}
                    </p>

                    <span className="inline-flex items-center text-[0.8rem] font-anton font-normal tracking-wide text-starttext">
                      Read More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {!blogs.length && (
            <p className="mt-4 text-center text-sm text-gray-400">
              No blogs available yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopReadBlogs;
