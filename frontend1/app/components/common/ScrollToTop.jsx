

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";
import { gsap } from "gsap";

export default function ScrollToTop() {
  const btnRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => {

      setShow(window.scrollY > 300);

      const footer = document.querySelector("footer");

      if (!footer) return;

      const rect = footer.getBoundingClientRect();

      setFooterVisible(rect.top < window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* GSAP animation */
  useEffect(() => {
    if (!btnRef.current) return;

    gsap.to(btnRef.current, {
      opacity: show ? 1 : 0,
      scale: show ? 1 : 0.85,
      pointerEvents: show ? "auto" : "none",
      duration: 0.25,
      ease: "power2.out",
    });

  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <button
      ref={btnRef}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Scroll to top"
      className={`fixed bottom-10 right-5 z-[9999] p-3 rounded-full shadow-xl transition-colors
      ${
        footerVisible
          ? "bg-white text-custom-blue"
          : "bg-custom-blue text-white"
      }`}
      style={{ opacity: 0 }}
    >
      <ArrowUp size={25} />
    </button>,
    document.body
  );
}