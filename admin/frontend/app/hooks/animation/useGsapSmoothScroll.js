"use client";
import { useEffect } from "react";
import { gsap } from "gsap";

export const useGsapSmoothScroll = () => {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: target,
            ease: "power2.inOut"
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
};
