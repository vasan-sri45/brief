"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useGsapHeroTabs = () => {
  const tabsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        tabsRef.current?.children || [],
        { opacity: 0, y: 25, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6, 
          stagger: 0.12,
          ease: "power2.out"
        }
      );
    }, tabsRef);

    return () => ctx.revert();
  }, []);

  return tabsRef;
};
