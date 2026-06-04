"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGsapHeroTitle = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40, scale: 0.9, rotationX: -15 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: "back.out(1.7)"
        }
      );
    }, titleRef);

    return () => ctx.revert();
  }, []);

  return titleRef;
};
