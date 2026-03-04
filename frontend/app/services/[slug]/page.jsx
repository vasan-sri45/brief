
"use client";

import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useAuthGuard } from "../../components/route/useAuthGuard";
import { useGsapScrollReveal } from "../../hooks/useGsapScrollReveal";
import { useServiceBySlug } from "../../hooks/useServiceBySlug";
import { useGsapHeroTitle } from "../../hooks/animation/useGsapHeroTitle";

import ServiceHero from "../../components/services/ServiceHero";
import LegalCard from "../../components/services/LegalCard";
import DocumentsRequired from "../../components/services/DocumentsRequired";
import IncorporationProcess from "../../components/services/InCoporationProcess";
import ProcessAtBriefcase from "../../components/services/ProcessAtBriefCasse";
import BoxClasses from "../../components/services/ClassGrid";
import SocialMedia from "../../components/common/SocialMedia";

gsap.registerPlugin(ScrollTrigger);



export default function ServiceSlugPage() {

const [activeTab, setActiveTab] = useState("description");
const titleRef = useGsapHeroTitle();

/* ================= AUTH ================= */
// const { loading: authLoading } = useAuthGuard(["user"]);

/* ================= ROUTE ================= */
const { slug } = useParams();
const router = useRouter();
const searchParams = useSearchParams();
const contentFilter = searchParams?.get("content")?.toLowerCase().trim();

/* ================= DATA ================= */
const { service, isLoading, error } = useServiceBySlug(slug);

/* ================= SECTION REFS ================= */
const sectionRefs = {
description: useRef(null),
documents: useRef(null),
process: useRef(null),
legal: useRef(null)
};

const legalRef = useRef(null);
const briefcaseRef = useRef(null);
const boxClassesRef = useRef(null);

/* ================= FILTER ================= */
const norm = useCallback((v = "") => String(v).toLowerCase().trim(), []);

const filteredData = useMemo(() => {
if (!service) return null;
if (!contentFilter) return service;


return {
  ...service,
  content:
    service.content?.filter((item) =>
      norm(item.name || item.title || "").includes(contentFilter)
    ) || [],
};


}, [service, contentFilter, norm]);

/* ================= SCROLL TO SECTION ================= */
const scrollToSection = (tab) => {
setActiveTab(tab);
const el = sectionRefs[tab]?.current;
if (!el) return;


el.scrollIntoView({
  behavior: "smooth",
  block: "start",
});


};

/* ================= ACTIVE TAB ON SCROLL ================= */
useEffect(() => {
const observers = [];

Object.entries(sectionRefs).forEach(([key, ref]) => {
  if (!ref.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setActiveTab(key);
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  observer.observe(ref.current);
  observers.push(observer);
});

return () => observers.forEach((o) => o.disconnect());

}, []);

/* ================= SCROLL ANIMATIONS ================= */
useGsapScrollReveal(legalRef, { y: 40, stagger: 0.15 });
useGsapScrollReveal(sectionRefs.documents, { y: 50, stagger: 0.2 });
useGsapScrollReveal(sectionRefs.process, { y: 60, stagger: 0.25 });
useGsapScrollReveal(briefcaseRef, { y: 50, stagger: 0.2 });

/* ================= STATES ================= */
// if (authLoading || isLoading) {
// return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
// }

if (error || !filteredData) {
return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
}

/* ================= JSX ================= */
return ( <div className="overflow-hidden">
  <div className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0 mt-4">
     <h1
          ref={titleRef}
          className="hero-title font-anton font-medium text-[1.2rem] md:text-[1.8rem] text-custom-blue mb-3 uppercase tracking-[0.08em]"
        >
          {service?.heading}
        </h1>
  </div>
  {/* TABS NAVBAR */}
  <div className="w-full mx-auto px-2 lg:w-10/12 lg:p-0 hero-tabs flex gap-6 text-sm md:text-lg text-custom-blue font-lato font-bold sticky  bg-white z-40">
    {["description", "documents", "process"].map((tab) => (
      <button
        key={tab}
        onClick={() => scrollToSection(tab)}
        className={`pb-2 border-b-2 transition-all duration-300 ${
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
  <section ref={sectionRefs.description}>
    <ServiceHero service={filteredData} />
  </section>

  {/* LEGAL CONTENT */}
  {filteredData.content?.length > 0 && (
    <section ref={legalRef}>
      <LegalCard legal={filteredData.content} service={filteredData} />
    </section>
  )}

  {/* DOCUMENTS */}
  {filteredData.documents?.length > 0 && (
    <section ref={sectionRefs.documents}>
      <DocumentsRequired docs={filteredData.documents} variant="cards" />
    </section>
  )}

  {/* LEGALS REQUIRED */}

   {filteredData.legalRequireds?.length > 0 && (
    <section ref={sectionRefs.legal}>
      <LegalRequired docs={filteredData.legalRequireds} variant="cards"/>
    </section>
  )}


  {/* PROCESS */}
  {filteredData.process?.length > 0 && (
    <section ref={sectionRefs.process}>
      <IncorporationProcess process={filteredData.process} />
    </section>
  )}

  {/* BRIEFCASE PROCESS */}
  {filteredData.processAtBriefcase?.length > 0 && (
    <section ref={briefcaseRef}>
      <ProcessAtBriefcase brief={filteredData.processAtBriefcase} />
    </section>
  )}

  {/* TRADEMARK CLASSES */}
  {filteredData.trademark?.length > 0 && (
    <section ref={boxClassesRef}>
      <BoxClasses trade={filteredData.trademark} />
    </section>
  )}

  <SocialMedia />

</div>

);
}

