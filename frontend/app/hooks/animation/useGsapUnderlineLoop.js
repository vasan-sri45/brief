"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGsapUnderlineLoop = () => {
  const underlineRef = useRef(null);

  useEffect(() => {
    if (!underlineRef.current) return;

    const ctx = gsap.context(() => {
      const el = underlineRef.current;

      gsap.set(el, { xPercent: -100 });

      gsap.to(el, {
        xPercent: 100,
        duration: 1.8,
        ease: "linear",
        repeat: -1,
      });
    }, underlineRef);

    return () => ctx.revert();
  }, []);

  return underlineRef;
};
