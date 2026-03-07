"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGsapSectionHeading = (triggerDelay = 0) => {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
          rotationX: -10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          delay: triggerDelay,
          ease: "back.out(1.7)",
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, [triggerDelay]);

  return headingRef;
};
