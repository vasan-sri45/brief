"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import BlogCard from "./BlogCard";

const GAP = 16;

const BlogInfiniteSlider = ({ blogs }) => {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!blogs?.length) return;
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children).slice(0, blogs.length);
    const totalWidth = cards.reduce(
      (acc, card) => acc + card.offsetWidth + GAP,
      0
    );

    gsap.set(track, { width: totalWidth * 2 });
    tweenRef.current?.kill();

    tweenRef.current = gsap.to(track, {
      x: `-=${totalWidth}`,
      duration: 35,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    const pause = () => tweenRef.current?.pause();
    const play = () => tweenRef.current?.resume();

    sliderRef.current?.addEventListener("mouseenter", pause);
    sliderRef.current?.addEventListener("mouseleave", play);

    return () => {
      tweenRef.current?.kill();
      sliderRef.current?.removeEventListener("mouseenter", pause);
      sliderRef.current?.removeEventListener("mouseleave", play);
    };
  }, [blogs]);

  if (!blogs?.length) return null;

  return (
    <section className="w-full overflow-hidden py-10">
      <div ref={sliderRef} className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex gap-4 will-change-transform">
          {[...blogs, ...blogs].map((blog, idx) => (
            <BlogCard key={idx} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogInfiniteSlider;
