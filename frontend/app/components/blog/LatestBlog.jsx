"use client";
import React from "react";
import Link from "next/link";
import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";
import {ArrowRight} from "lucide-react";

const LatestBlogCard = ({ blog }) => {
  const headingRef = useGsapSectionHeading(0.2);
  const underlineRef = useGsapUnderlineLoop();

  console.log(blog)

  return (
    <section>
       <div className="text-start">
          <h2 
            ref={headingRef}
            className="section-heading font-anton font-normal text-[1rem] md:text-[1.1rem] lg:text-[1.3rem] text-custom-blue tracking-wide"
          >
            Latest Blog
          </h2>
        
          <div className="flex justify-start mb-3 overflow-hidden">
            <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
              {/* GSAP-driven infinite underline */}
              <span
                ref={underlineRef}
                className="underline-glow absolute inset-0 rounded-full bg-white/70"
              />
            </span>
          </div>
        </div>
    <div className="w-full h-[380px] md:h-[450px] lg:h-[560px] p-4 rounded-md border-2 border-custom-blue">

      <div className="p-1 flex flex-col h-full">
        {/* Image */}
        <img 
          src={blog.documents?.[0]?.url || "/placeholder.png"} 
          className="w-full h-[220px] md:h-[280px] lg:h-[360px] bg-[#E0B15F] border-2 border-custom-blue rounded-md mb-2 shrink-0"
        />
        {/* Content */}
        <div className="flex flex-col flex-1">
          
          <h3 className="text-custom-blue font-anton font-normal text-[0.9rem] md:text-[0.9rem] lg:text-[1.1rem] leading-snug mb-1 tracking-wide uppercase">
            {blog.title}
          </h3>


          <p className="text-[0.7rem] md:text-[1rem] text-letter1 mb-2 line-clamp-3 font-lato font-bold">
            {blog.content?.slice(0, 120) + "..."}
          </p>

          {/* DATE + READ MORE (FIXED) */}
          <div className="flex items-center justify-between">
            <p className="text-[0.7rem] md:text-[0.8rem] text-gray-400 text-anton font-normal">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            <Link
              href={`/blogs/${blog.slug}`}
              className="text-startbtn text-[0.8rem] font-anton font-normal tracking-wide"
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
    </div>
    </section>
  );
};

export default LatestBlogCard;
