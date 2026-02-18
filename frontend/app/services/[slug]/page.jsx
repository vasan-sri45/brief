

"use client";

import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useAuthGuard } from "../../components/route/useAuthGuard";
import { useGsapScrollReveal } from "../../hooks/useGsapScrollReveal";
import { useServiceBySlug } from "../../hooks/useServiceBySlug";

import ServiceHero from "../../components/services/ServiceHero";
import LegalCard from "../../components/services/LegalCard";
import DocumentsRequired from "../../components/services/DocumentsRequired";
import IncorporationProcess from "../../components/services/InCoporationProcess";
import ProcessAtBriefcase from "../../components/services/ProcessAtBriefCasse";
import BoxClasses from "../../components/services/ClassGrid";
import SocialMedia from "../../components/common/SocialMedia";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceSlugPage() {
  /* ================= AUTH ================= */
  const { loading: authLoading } = useAuthGuard(["user"]);

  /* ================= ROUTE ================= */
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentFilter = searchParams?.get("content")?.toLowerCase().trim();

  /* ================= DATA ================= */
  const { service, isLoading, error } = useServiceBySlug(slug);

  /* ================= REFS ================= */
  const heroRef = useRef(null);
  const legalRef = useRef(null);
  const documentsRef = useRef(null);
  const processRef = useRef(null);
  const briefcaseRef = useRef(null);
  const boxClassesRef = useRef(null);

  /* ================= HELPERS ================= */
  const norm = useCallback(
    (v = "") => String(v).toLowerCase().trim(),
    []
  );

  /* ================= FILTER ================= */
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

  /* ================= GSAP HERO ================= */
  useEffect(() => {
    if (!filteredData) return;

    const ctx = gsap.context(() => {
      const title = heroRef.current?.querySelector(".hero-title");
      const tabs = heroRef.current?.querySelectorAll(".hero-tabs button");

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      }

      if (tabs?.length) {
        gsap.fromTo(
          tabs,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1 }
        );
      }
    });

    return () => ctx.revert();
  }, [filteredData]);

  console.log(filteredData)

  /* ================= SCROLL ANIMATIONS ================= */
  useGsapScrollReveal(legalRef, { y: 40, stagger: 0.15 });
  useGsapScrollReveal(documentsRef, { y: 50, stagger: 0.2 });
  useGsapScrollReveal(processRef, { y: 60, stagger: 0.25 });
  useGsapScrollReveal(briefcaseRef, { y: 50, stagger: 0.2 });

  /* ================= NAV TO PRICING ================= */
  const handleGoToPricing = () => {
    router.push(
      `/services/${slug}/pricing?price=${filteredData.price}&title=${filteredData.title}`
    );
  };

  /* ================= STATES ================= */
  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !filteredData) {
    return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
  }

  if (contentFilter && filteredData.content.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">No content found</div>;
  }

  /* ================= JSX ================= */
  return (
    <div className="overflow-hidden">
      {filteredData.description && (
        <div ref={heroRef}>
          <ServiceHero service={filteredData} />
        </div>
      )}

      {filteredData.content?.length > 0 && (
        <section ref={legalRef}>
          <LegalCard legal={filteredData.content} service={filteredData} />
        </section>
      )}

      {filteredData.documents?.length > 0 && (
        <section ref={documentsRef}>
          <DocumentsRequired docs={filteredData.documents} variant="cards" />
        </section>
      )}

      {filteredData.process?.length > 0 && (
        <section ref={processRef}>
          <IncorporationProcess process={filteredData.process} />
        </section>
      )}

      {filteredData.processAtBriefcase?.length > 0 && (
        <section ref={briefcaseRef}>
          <ProcessAtBriefcase brief={filteredData.processAtBriefcase} />
        </section>
      )}


      {filteredData.trademark?.length > 0 && (
        <section ref={boxClassesRef}>
             <BoxClasses trade={filteredData.trademark}/>
        </section>
      )}

   

      {/* 🔥 CTA */}
      {/* <div className="flex justify-center my-12">
        <button
          onClick={handleGoToPricing}
          className="px-8 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-[#1E40AF]"
        >
          Proceed to Pricing
        </button>
      </div> */}

      <SocialMedia />
      
    </div>
  );
}
