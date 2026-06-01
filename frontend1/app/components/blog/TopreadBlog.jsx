"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";
import {ArrowRight} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TopReadBlogs = ({ blogs = [] }) => {
  const headingRef = useGsapSectionHeading(0.2);
  const underlineRef = useGsapUnderlineLoop();
  const listRef = useRef([]);

  useEffect(() => {
    if (!listRef.current.length) return;

    gsap.fromTo(
      listRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: listRef.current[0],
          start: "top 85%",
        },
      }
    );
  }, [blogs]);

  return (
    <section>
      {/* Heading */}
      <div className="text-start">
        <h2
          ref={headingRef}
          className="section-heading font-poppins font-semibold text-[1rem] md:text-[1.1rem] lg:text-[1.3rem] text-custom-blue"
        >
          Top Read
        </h2>

        <div className="flex justify-start mb-3 overflow-hidden">
          <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
            <span
              ref={underlineRef}
              className="underline-glow absolute inset-0 rounded-full bg-white/70"
            />
          </span>
        </div>
      </div>

      {/* Blog List */}
      <div className="w-full rounded-md">
        <div className="h-[350px] md:h-[450px] lg:h-[540px] overflow-y-auto pr-1 flex flex-col gap-4">
          {blogs.map((blog, index) => {
            const thumb = blog.documents?.[0]?.url || "/placeholder.png";
            const date = blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "";

            return (
              <div
                key={blog._id || index}
                ref={(el) => (listRef.current[index] = el)}
                className="flex gap-3"
              >
                {/* Thumbnail */}
                <img
                  src={thumb}
                  alt={blog.title}
                  className="w-24 h-24 rounded-sm object-cover border border-custom-blue/70"
                />

                {/* Content */}
                <div className="flex flex-col w-full">
                  <h3 className="text-custom-blue text-[0.7rem] lg:text-[0.8rem] font-anton font-normal tracking-wide leading-snug line-clamp-2 mb-2">
                    {blog.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <p className="text-[0.7rem] md:text-[0.8rem] text-gray-400 font-bold">
                      {date}
                    </p>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-starttext text-[0.8rem] font-anton font-normal tracking-wide"
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
              </div>
            );
          })}

          {/* If empty */}
          {!blogs.length && (
            <p className="text-center text-gray-400 text-sm mt-4">
              No blogs available yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopReadBlogs;
