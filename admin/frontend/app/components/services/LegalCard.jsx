"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAllServices } from "../../hooks/userServiceList"; // optional fallback
import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

export default function TalkToLawyer({ content = [], service = null }) {
  // fallback: try fetching if no content prop passed (optional)
  const { data: fallbackData } = useAllServices?.() || { data: null };
  const fallbackService = fallbackData?.items?.[0] || null;

  const headingRef = useGsapSectionHeading(0.2);
     const underlineRef = useGsapUnderlineLoop();

  const getTitle = (c, idx) =>
    c?.name || c?.title || c?.heading || `Consultation ${idx + 1}`;

  const getDesc = c =>
    c?.details || c?.description || c?.text || c?.summary || "";

  const items = useMemo(() => {
    // prefer content prop if provided and non-empty
    const source = Array.isArray(content) && content.length > 0
      ? content
      : // else try service.content if service passed
      (service && Array.isArray(service.content) && service.content.length > 0)
      ? service.content
      : // else fallback to first service from useAllServices (if available)
      (fallbackService && Array.isArray(fallbackService.content) && fallbackService.content.length > 0)
      ? fallbackService.content
      : [];

    if (source.length > 0) {
      return source.slice(0, 4).map((c, idx) => {
        const title = getTitle(c, idx);
        const desc = getDesc(c) || "Service details not available.";
        // pick slug from passed service if available, else fallbackService, else '#'
        const slug = service?.slug || fallbackService?.slug || null;
        const href = slug ? `/services/${slug}?content=${encodeURIComponent(title)}` : "#";
        return { title, desc, href };
      });
    }

    // final fallback static cards
    return [
      {
        title: "Consult An Advocate",
        desc: "Get expert legal advice from qualified advocates for all your business needs.",
        href: "#",
      },
      {
        title: "Consult A Senior Advocate",
        desc: "Premium consultation with senior legal experts for complex matters.",
        href: "#",
      },
      {
        title: "Express Consultation",
        desc: "Fast-track legal advice within 24 hours for urgent business decisions.",
        href: "#",
      },
      {
        title: "Priority Consultation",
        desc: "VIP legal support with a dedicated relationship manager.",
        href: "#",
      },
    ];
  }, [content, service, fallbackService]);

  return (
    <section className="w-full pt-4 pb-3 lg:pt-12">
      <div className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
        <header className="mb-8 text-center">
          <h2 className="font-anton font-medium text-[1.2rem] md:text-[1.8rem] text-custom-blue tracking-widest uppercase">TALK TO LAWYER</h2>
         
          <div className="mt-2 flex justify-center mb-6 overflow-hidden">
            <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
              {/* GSAP-driven infinite underline */}
              <span
                ref={underlineRef}
                className="underline-glow absolute inset-0 rounded-full bg-white/70"
              />
            </span>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No consultation options available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between h-full rounded-[18px] bg-white border-2 border-custom-blue shadow-[0_8px_18px_rgba(0,0,0,0.12)] px-6 py-6 min-h-[340px] md:px-8 md:py-8 md:min-h-[360px] transition-all duration-300 hover:shadow-2xl  
                hover:bg-starttext hover:border-starttext
                hover:scale-105"
              >
                <div className="flex-1 flex flex-col justify-between min-h-0">
                  <h3 className="font-lato font-bold text-base md:text-xl text-custom-blue text-center mb-4 md:mb-6 leading-tight transition-all duration-300 ease-out group-hover:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-6 md:leading-7 text-letter1 font-lato mb-6 text-justify font-bold line-clamp-4 md:line-clamp-5 transition-all duration-300 flex-1 group-hover:text-white/95">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-auto flex justify-end pt-2 ">
                  <Link href={item.href} className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-starttext shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2
                     text-white text-xs
                      group-hover:bg-white">
                    <span className="font-lato font-semibold text-xs md:text-lg text-white group-hover:text-custom-blue tracking-wide">Book Slot</span>
          
                    <ArrowRight className="ml-2 w-5 h-5 md:w-7 md:h-7 group-hover:text-custom-blue" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
