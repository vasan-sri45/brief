"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ChevronUp
} from "lucide-react";
import { gsap } from "gsap";

export default function ScrollToTopSocialFAB() {
  const mainBtnRef = useRef(null);
  const iconsRef = useRef([]);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  /* Mount on client */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* GSAP animation */
  useEffect(() => {
    if (!iconsRef.current.length) return;

    gsap.to(iconsRef.current, {
      opacity: open ? 1 : 0,
      y: open ? 0 : 18,
      scale: open ? 1 : 0.85,
      pointerEvents: open ? "auto" : "none",
      stagger: 0.08,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(mainBtnRef.current, {
      rotate: open ? 180 : 0,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-30 right-5 z-[9999] flex flex-col items-center gap-3">
      {/* SOCIAL ICONS */}
      {[
        {
          Icon: MessageCircle, // WhatsApp substitute
          href: "https://wa.me/919999999999",
          bg: "bg-green-500",
          label: "WhatsApp",
        },
        {
          Icon: Facebook,
          href: "https://facebook.com",
          bg: "bg-blue-600",
          label: "Facebook",
        },
        {
          Icon: Instagram,
          href: "https://www.instagram.com/briefcasse_?igsh=emI0MW1mcGdnMzVj",
          bg: "bg-pink-500",
          label: "Instagram",
        },
        {
          Icon: Youtube,
          href: "https://youtube.com",
          bg: "bg-red-600",
          label: "YouTube",
        },
      ].map(({ Icon, href, bg, label }, i) => (
        <a
          key={label}
          ref={(el) => (iconsRef.current[i] = el)}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`w-11 h-11 flex items-center justify-center
                      rounded-full text-white shadow-lg ${bg}`}
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <Icon size={20} />
        </a>
      ))}

      {/* MAIN TOGGLE BUTTON */}
      <button
        ref={mainBtnRef}
        onClick={() => {
          setOpen((v) => !v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Scroll to top"
        className="flex items-center justify-center
                   rounded-full bg-starttext text-white shadow-xl p-2.5"
      >
        {/* <ArrowUp size={25} /> */}
        <ChevronUp size={32} />
      </button>
    </div>,
    document.body
  );
}
