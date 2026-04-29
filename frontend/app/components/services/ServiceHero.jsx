"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import HeroButton from "./HeroButton";
import { useGsapHeroTitle } from "../../hooks/animation/useGsapHeroTitle";
import { useGsapHeroTabs } from "../../hooks/animation/useGsapHeroTabs";
import { useGsapSmoothScroll } from "../../hooks/animation/useGsapSmoothScroll";
import { useSelector } from "react-redux";

const ServiceHero = ({ service }) => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

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


  const handleStartService = () => {
  if (!service?.slug) return;

  const pricingUrl = `/services/${service.slug}/pricing`;

  if (user) {
    router.push(pricingUrl);
  } else {
    
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
};


  return (
    <section className="w-full pt-1 md:pt-3">
      <div className="w-full mx-auto px-2 pt-0 pb-2 md:p-4 lg:w-10/12 lg:p-0">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr] gap-6">
          <div>

            <p className="mt-4 max-w-xl text-justify leading-8 font-lato font-semibold text-letter1">
              {descriptionText}
            </p>
            <HeroButton handleStartService={handleStartService}/>
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
