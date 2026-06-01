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
      <div className="w-full mx-auto px-2 md:px-4 lg:w-10/12 lg:p-0">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr] gap-6">
          <div>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-xl text-justify leading-8 font-lato font-semibold text-letter1">
              {descriptionText}
            </p>

            {/* START SERVICE BUTTON */}
            <button
              onClick={handleStartService}
              className="mt-6 inline-flex items-center px-6 py-2 rounded-full font-lato font-bold
                         bg-starttext text-white shadow 
                         hover:shadow-lg hover:scale-105 
                         transition-all duration-300"
            >
              START THE SERVICE
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

           <div className="
      relative
      w-full
      h-44
      sm:h-52
      md:h-64
      lg:h-72
      rounded-xl
      overflow-hidden
      shadow-lg
    ">

    <img
      src={service?.images?.[0]?.url}
      alt={service?.heading}
      className="
        w-full
        h-full
        
        object-center
      "
    />

  </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;

