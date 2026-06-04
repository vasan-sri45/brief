"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import HeroButton from "./HeroButton";
import { useGsapHeroTitle } from "../../hooks/animation/useGsapHeroTitle";
import { useGsapHeroTabs } from "../../hooks/animation/useGsapHeroTabs";
import { useGsapSmoothScroll } from "../../hooks/animation/useGsapSmoothScroll";
import { useSelector } from "react-redux";
import ServiceMedia from "./ServiceMedia";
import { getCanonicalServiceSlug } from "../../utils/serviceSlug";

const ServiceHero = ({ service }) => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // 🎯 GSAP hooks
  const titleRef = useGsapHeroTitle();
  const tabsRef = useGsapHeroTabs();
  useGsapSmoothScroll();

  const descriptionText =
    service?.shortDescription ||
    service?.description ||
    service?.fullDescription ||
    "Want to register your Private Limited Company? We've got you covered!";

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleStartService = () => {
  const canonicalSlug = getCanonicalServiceSlug(service);
  if (!canonicalSlug) return;

  const pricingUrl = `/services/${canonicalSlug}/pricing`;

  if (user) {
    router.push(pricingUrl);
  } else {
    router.push(`/login?redirect=${encodeURIComponent(pricingUrl)}`);
  }
};


  return (
    <section className="w-full pt-1 md:pt-3">
      <div className="w-full mx-auto px-4 pt-0 pb-2 md:p-4 lg:w-10/12 lg:p-0">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr] gap-6">
          <div>

            <p className="mt-4 max-w-xl text-left text-sm leading-7 font-lato font-semibold text-letter1 md:text-justify md:text-base md:leading-8">
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
            rounded-2xl
            overflow-hidden
            shadow-lg
          ">

            <ServiceMedia
              service={service}
              priority
              className="h-full w-full object-cover object-center"
              fallback={
              <div className="flex h-full w-full items-center justify-center bg-blue-50 text-sm font-bold text-blue-600">
                Briefcasse Service
              </div>
              }
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
