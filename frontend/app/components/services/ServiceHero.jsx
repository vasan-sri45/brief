"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGsapHeroTitle } from "../../hooks/animation/useGsapHeroTitle";
import { useGsapHeroTabs } from "../../hooks/animation/useGsapHeroTabs";
import { useGsapSmoothScroll } from "../../hooks/animation/useGsapSmoothScroll";

const ServiceHero = ({ service }) => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();

  // 🎯 GSAP hooks
  const titleRef = useGsapHeroTitle();
  const tabsRef = useGsapHeroTabs();
  useGsapSmoothScroll();

  const descriptionText =
    service?.description ||
    "Want to register your Private Limited Company? We've got you covered!";

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  /* ================= NAVIGATE TO PRICE PAGE ================= */
  const handleStartService = () => {
    if (!service?.slug) return;

    router.push(`/services/${service.slug}/pricing`);
  };

  return (
    <section className="w-full pt-1 md:pt-6">
      <div className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">

        {/* TITLE */}
        <h1
          ref={titleRef}
          className="hero-title font-anton font-medium text-[1.2rem] md:text-[1.8rem] text-custom-blue mb-3 uppercase tracking-[0.08em]"
        >
          {service?.heading}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr] gap-6">
          <div>

            {/* TABS */}
            <div
              ref={tabsRef}
              className="hero-tabs flex gap-6 text-sm md:text-lg text-custom-blue font-lato font-bold"
            >
              {["description", "documents", "process"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`pb-1 border-b-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "border-starttext text-starttext"
                      : "border-transparent hover:border-[#C58E3B]/50"
                  }`}
                >
                  {tab === "description"
                    ? "Description"
                    : tab === "documents"
                    ? "Documents Required"
                    : "Process"}
                </button>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-xl text-justify leading-8 font-lato font-semibold text-letter1">
              {descriptionText}
            </p>

            {/* START SERVICE BUTTON */}
            <button
              onClick={handleStartService}
              className="mt-6 inline-flex items-center px-6 py-2 rounded-full font-lato font-bold
                         bg-starttext text-custom-blue shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              START THE SERVICE
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* RIGHT HERO CARD */}
          {/* <div className="hero-bg h-40 md:h-64 bg-gradient-to-br from-custom-blue to-[#1E3A8A] rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E3A849]/10 via-transparent to-[#C58E3B]/10 animate-pulse" />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
