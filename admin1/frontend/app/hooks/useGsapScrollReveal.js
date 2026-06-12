"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGsapScrollReveal = (
  ref,
  {
    y = 30,
    duration = 1,
    stagger = 0.2,
    start = "top 80%",
  } = {}
) => {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, y, duration, stagger, start]);
};
