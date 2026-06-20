"use client";
import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useServiceBySlug } from "../../hooks/useServiceBySlug";
import ServiceHero from "../../components/services/ServiceHero";
import LegalCard from "../../components/services/LegalCard";
import DocumentsRequired from "../../components/services/DocumentsRequired";
import LegalRequired from "../../components/services/LegalRequired";
import IncorporationProcess from "../../components/services/InCoporationProcess";
import ProcessAtBriefcasse from "../../components/services/ProcessAtBriefCasse";
import BoxClasses from "../../components/services/ClassGrid";
import { getServiceFaqs, getServiceTitle } from "../../config/site";

const normalizeFaqs = (serviceFaqs, fallbackFaqs = []) => {
  const dynamicFaqs = Array.isArray(serviceFaqs)
    ? serviceFaqs
        .filter((faq) => {
          const question = String(faq?.question || "").trim();
          const answer = String(faq?.answer || "").trim();
          return question && answer;
        })
        .sort(
          (a, b) =>
            Number(a?.displayOrder ?? 0) - Number(b?.displayOrder ?? 0)
        )
        .map((faq) => ({
          question: String(faq.question).trim(),
          answer: String(faq.answer).trim(),
        }))
    : [];

  if (dynamicFaqs.length > 0) return dynamicFaqs;

  return Array.isArray(fallbackFaqs)
    ? fallbackFaqs
        .filter((faq) => {
          const question = String(faq?.question || "").trim();
          const answer = String(faq?.answer || "").trim();
          return question && answer;
        })
        .map((faq) => ({
          question: String(faq.question).trim(),
          answer: String(faq.answer).trim(),
        }))
    : [];
};


export default function ServiceSlugPage({ initialService = null, initialSeo = null }) {

const [activeTab, setActiveTab] = useState("description");
const titleRef = useRef(null);

/* ================= AUTH ================= */
// const { loading: authLoading } = useAuthGuard(["user"]);

/* ================= ROUTE ================= */
const { slug } = useParams();
const searchParams = useSearchParams();
const contentFilter = searchParams?.get("content")?.toLowerCase().trim();

/* ================= DATA ================= */
const {
  service: fetchedService,
  isLoading,
  error,
} = useServiceBySlug(slug, {
  initialData: initialService || undefined,
});
const service = fetchedService || initialService;

/* ================= SECTION REFS ================= */
const descriptionRef = useRef(null);
const documentsRef = useRef(null);
const processRef = useRef(null);
const legalSectionRef = useRef(null);

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
const getSectionRef = useCallback((tab) => {
if (tab === "description") return descriptionRef;
if (tab === "documents") return documentsRef;
if (tab === "process") return processRef;
if (tab === "legal") return legalSectionRef;
return null;
}, []);

const scrollToSection = (tab) => {
setActiveTab(tab);
const el = getSectionRef(tab)?.current;
if (!el) return;


el.scrollIntoView({
  behavior: "smooth",
  block: "start",
});


};

/* ================= ACTIVE TAB ON SCROLL ================= */
useEffect(() => {
const observers = [];
const refs = {
  description: descriptionRef,
  documents: documentsRef,
  process: processRef,
  legal: legalSectionRef,
};

Object.entries(refs).forEach(([key, ref]) => {
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

/* ================= STATES ================= */
// if (authLoading || isLoading) {
// return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
// }

if (isLoading && !initialService) {
return <div className="min-h-screen flex items-center justify-center">Loading service...</div>;
}

if ((error && !initialService) || !filteredData) {
return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
}

const seoTitle = initialSeo?.title || getServiceTitle(filteredData, slug);
const faqs = normalizeFaqs(
  filteredData.faqs,
  initialSeo?.faqs || getServiceFaqs(filteredData, slug)
);

/* ================= JSX ================= */
return ( <div className="overflow-hidden">
  <div className="w-full mx-auto px-4 py-2 md:p-4 lg:w-10/12 lg:p-0 mt-4">
     <h1
          ref={titleRef}
          className="hero-title font-anton font-medium text-[1.35rem] leading-tight md:text-[1.8rem] text-custom-blue mb-3 uppercase tracking-[0.08em]"
        >
          {seoTitle}
        </h1>
  </div>
  {/* TABS NAVBAR */}
  <div className="w-full mx-auto px-3 md:px-4 lg:w-10/12 lg:p-0 hero-tabs flex gap-5 overflow-x-auto whitespace-nowrap text-sm md:text-lg text-custom-blue font-lato font-bold sticky bg-white z-40">
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
  <section ref={descriptionRef}>
    <ServiceHero service={filteredData} />
  </section>

  <section className="w-full mx-auto px-4 py-2 md:p-4 lg:w-10/12 lg:p-0">
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="border border-custom-blue/20 bg-white p-5 shadow-sm rounded-2xl">
        <h2 className="font-lato text-lg font-bold text-custom-blue">Who This Helps</h2>
        <p className="mt-2 text-sm font-lato font-semibold leading-7 text-letter1">
          Individuals, founders, startups, and business owners who need clear legal,
          tax, compliance, or registration support in India.
        </p>
      </div>
      <div className="border border-custom-blue/20 bg-white p-5 shadow-sm rounded-2xl">
        <h2 className="font-lato text-lg font-bold text-custom-blue">How Briefcasse Works</h2>
        <p className="mt-2 text-sm font-lato font-semibold leading-7 text-letter1">
          We review your requirement, confirm the document checklist, prepare the
          filing or advisory path, and guide you through submission and follow-up.
        </p>
      </div>
      <div className="border border-custom-blue/20 bg-white p-5 shadow-sm rounded-2xl">
        <h2 className="font-lato text-lg font-bold text-custom-blue">Local Trust</h2>
        <p className="mt-2 text-sm font-lato font-semibold leading-7 text-letter1">
          Briefcasse is a Chennai-based legal services platform serving clients
          across India with transparent communication and practical next steps.
        </p>
      </div>
    </div>

    {/* {seoDescription && (
      <p className="mt-6 max-w-4xl text-sm font-lato font-semibold leading-8 text-letter1">
        {seoDescription}
      </p>
    )} */}
  </section>

  {/* LEGAL CONTENT */}
  {filteredData.content?.length > 0 && (
    <section ref={legalRef}>
      <LegalCard legal={filteredData.content} service={filteredData} />
    </section>
  )}

  {/* DOCUMENTS */}
  {filteredData.documents?.length > 0 && (
    <section ref={documentsRef}>
      <DocumentsRequired docs={filteredData.documents} variant="cards" />
    </section>
  )}

  {/* LEGALS REQUIRED */}

   {filteredData.legalRequireds?.length > 0 && (
    <section ref={legalSectionRef}>
      <LegalRequired docs={filteredData.legalRequireds} variant="cards"/>
    </section>
  )}


  {/* PROCESS */}
  {filteredData.process?.length > 0 && (
    <section ref={processRef}>
      <IncorporationProcess process={filteredData.process} />
    </section>
  )}

  {/* BRIEFCASSE PROCESS */}
  {filteredData.processAtBriefcase?.length > 0 && (
    <section ref={briefcaseRef}>
      <ProcessAtBriefcasse brief={filteredData.processAtBriefcase} />
    </section>
  )}

  {/* TRADEMARK CLASSES */}
  {filteredData.trademark?.length > 0 && (
    <section ref={boxClassesRef}>
      <BoxClasses trade={filteredData.trademark} />
    </section>
  )}

  {faqs.length > 0 && (
    <section className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
      <h2 className="font-anton font-medium text-[1.2rem] md:text-[1.8rem] text-custom-blue mb-5 uppercase tracking-[0.07em]">
        Frequently Asked Question
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <article key={index} className="border border-custom-blue/20 bg-white p-5 shadow-sm rounded-2xl">
            <h3 className="font-lato text-base font-bold text-custom-blue">{faq.question}</h3>
            <p className="mt-2 text-sm font-lato font-semibold leading-7 text-letter1">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )}

</div>

);
}
