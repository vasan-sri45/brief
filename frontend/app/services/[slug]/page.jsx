
// // "use client";

// // import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
// // import { useParams, useSearchParams, useRouter } from "next/navigation";
// // import { gsap } from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";

// // import { useAuthGuard } from "../../components/route/useAuthGuard";
// // import { useGsapScrollReveal } from "../../hooks/useGsapScrollReveal";
// // import { useServiceBySlug } from "../../hooks/useServiceBySlug";
// // import { useGsapHeroTitle } from "../../hooks/animation/useGsapHeroTitle";

// // import ServiceHero from "../../components/services/ServiceHero";
// // import LegalCard from "../../components/services/LegalCard";
// // import DocumentsRequired from "../../components/services/DocumentsRequired";
// // import LegalRequired from "../../components/services/LegalRequired";
// // import IncorporationProcess from "../../components/services/InCoporationProcess";
// // import ProcessAtBriefcase from "../../components/services/ProcessAtBriefCasse";
// // import BoxClasses from "../../components/services/ClassGrid";
// // import SocialMedia from "../../components/common/SocialMedia";

// // gsap.registerPlugin(ScrollTrigger);



// // export default function ServiceSlugPage() {

// // const [activeTab, setActiveTab] = useState("description");
// // const titleRef = useGsapHeroTitle();

// // /* ================= AUTH ================= */
// // // const { loading: authLoading } = useAuthGuard(["user"]);

// // /* ================= ROUTE ================= */
// // const { slug } = useParams();
// // const router = useRouter();
// // const searchParams = useSearchParams();
// // const contentFilter = searchParams?.get("content")?.toLowerCase().trim();

// // /* ================= DATA ================= */
// // const { service, isLoading, error } = useServiceBySlug(slug);

// // /* ================= SECTION REFS ================= */
// // const sectionRefs = {
// // description: useRef(null),
// // documents: useRef(null),
// // process: useRef(null),
// // legal: useRef(null)
// // };

// // const legalRef = useRef(null);
// // const briefcaseRef = useRef(null);
// // const boxClassesRef = useRef(null);

// // /* ================= FILTER ================= */
// // const norm = useCallback((v = "") => String(v).toLowerCase().trim(), []);

// // const filteredData = useMemo(() => {
// // if (!service) return null;
// // if (!contentFilter) return service;


// // return {
// //   ...service,
// //   content:
// //     service.content?.filter((item) =>
// //       norm(item.name || item.title || "").includes(contentFilter)
// //     ) || [],
// // };


// // }, [service, contentFilter, norm]);

// // /* ================= SCROLL TO SECTION ================= */
// // const scrollToSection = (tab) => {
// // setActiveTab(tab);
// // const el = sectionRefs[tab]?.current;
// // if (!el) return;


// // el.scrollIntoView({
// //   behavior: "smooth",
// //   block: "start",
// // });


// // };

// // /* ================= ACTIVE TAB ON SCROLL ================= */
// // useEffect(() => {
// // const observers = [];

// // Object.entries(sectionRefs).forEach(([key, ref]) => {
// //   if (!ref.current) return;

// //   const observer = new IntersectionObserver(
// //     ([entry]) => {
// //       if (entry.isIntersecting) {
// //         setActiveTab(key);
// //       }
// //     },
// //     { rootMargin: "-40% 0px -55% 0px" }
// //   );

// //   observer.observe(ref.current);
// //   observers.push(observer);
// // });

// // return () => observers.forEach((o) => o.disconnect());

// // }, []);

// // /* ================= SCROLL ANIMATIONS ================= */
// // useGsapScrollReveal(legalRef, { y: 40, stagger: 0.15 });
// // useGsapScrollReveal(sectionRefs.documents, { y: 50, stagger: 0.2 });
// // useGsapScrollReveal(sectionRefs.process, { y: 60, stagger: 0.25 });
// // useGsapScrollReveal(briefcaseRef, { y: 50, stagger: 0.2 });

// // /* ================= STATES ================= */
// // // if (authLoading || isLoading) {
// // // return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
// // // }

// // if (error || !filteredData) {
// // return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
// // }

// // /* ================= JSX ================= */
// // return ( <div className="overflow-hidden">
// //   <div className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0 mt-4">
// //      <h1
// //           ref={titleRef}
// //           className="hero-title font-anton font-medium text-[1.2rem] md:text-[1.8rem] text-custom-blue mb-3 uppercase tracking-[0.08em]"
// //         >
// //           {service?.heading}
// //         </h1>
// //   </div>
// //   {/* TABS NAVBAR */}
// //   <div className="w-full mx-auto px-2 lg:w-10/12 lg:p-0 hero-tabs flex gap-6 text-sm md:text-lg text-custom-blue font-lato font-bold sticky  bg-white z-40">
// //     {["description", "documents", "process"].map((tab) => (
// //       <button
// //         key={tab}
// //         onClick={() => scrollToSection(tab)}
// //         className={`pb-2 border-b-2 transition-all duration-300 ${
// //           activeTab === tab
// //             ? "border-starttext text-starttext"
// //             : "border-transparent hover:border-[#C58E3B]/50"
// //         }`}
// //       >
// //         {tab === "description"
// //           ? "Description"
// //           : tab === "documents"
// //           ? "Documents Required"
// //           : "Process"}
// //       </button>
// //     ))}
// //   </div>

// //   {/* DESCRIPTION */}
// //   <section ref={sectionRefs.description}>
// //     <ServiceHero service={filteredData} />
// //   </section>

// //   {/* LEGAL CONTENT */}
// //   {filteredData.content?.length > 0 && (
// //     <section ref={legalRef}>
// //       <LegalCard legal={filteredData.content} service={filteredData} />
// //     </section>
// //   )}

// //   {/* DOCUMENTS */}
// //   {filteredData.documents?.length > 0 && (
// //     <section ref={sectionRefs.documents}>
// //       <DocumentsRequired docs={filteredData.documents} variant="cards" />
// //     </section>
// //   )}

// //   {/* LEGALS REQUIRED */}

// //    {filteredData.legalRequireds?.length > 0 && (
// //     <section ref={sectionRefs.legal}>
// //       <LegalRequired docs={filteredData.legalRequireds} variant="cards"/>
// //     </section>
// //   )}


// //   {/* PROCESS */}
// //   {filteredData.process?.length > 0 && (
// //     <section ref={sectionRefs.process}>
// //       <IncorporationProcess process={filteredData.process} />
// //     </section>
// //   )}

// //   {/* BRIEFCASE PROCESS */}
// //   {filteredData.processAtBriefcase?.length > 0 && (
// //     <section ref={briefcaseRef}>
// //       <ProcessAtBriefcase brief={filteredData.processAtBriefcase} />
// //     </section>
// //   )}

// //   {/* TRADEMARK CLASSES */}
// //   {filteredData.trademark?.length > 0 && (
// //     <section ref={boxClassesRef}>
// //       <BoxClasses trade={filteredData.trademark} />
// //     </section>
// //   )}

// //   <SocialMedia />

// // </div>

// // );
// // }

// // app/services/[slug]/page.jsx
// // ⚠️ "use client" வேண்டவே வேண்டாம்!

// import ServiceSlugClient from "./ServiceSlugClient";

// export async function generateMetadata({ params }) {
//   try {
//     // ✅ Server-side-ல் direct backend URL use செய்கிறோம்
//     // (browser proxy "/api" இல்லை — direct backend!)
//     const res = await fetch(
//       `http://localhost:4500/api/services`,
//       {
//         cache: "no-store", // always fresh data
//       }
//     );

//     if (!res.ok) {
//       return fallbackMetadata();
//     }

//     const data = await res.json();

//     // slug-ஐ வைத்து service find செய்கிறோம்
//     const service = data?.items?.find((s) => s.slug === params.slug);

//     if (!service) {
//       return fallbackMetadata();
//     }

//     return {
//       title: service?.heading || service?.name || "Legal Service",
//       description:
//         service?.description ||
//         `${service?.heading} — Reliable trademark & legal services by Briefcasse.`,
//       alternates: {
//         canonical: `/services/${params.slug}`,
//       },
//       openGraph: {
//         type: "website",
//         title: `${service?.heading || "Legal Service"} | Briefcasse`,
//         description:
//           service?.description ||
//           "Easy and reliable trademark registration and legal services.",
//         url: `https://www.briefcasse.com/services/${params.slug}`,
//         siteName: "Briefcasse",
//         images: [
//           {
//             url: service?.image || "/assets/brief_blue.png",
//             width: 1200,
//             height: 630,
//             alt: service?.heading || "Briefcasse Legal Service",
//           },
//         ],
//         locale: "en_IN",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: `${service?.heading || "Legal Service"} | Briefcasse`,
//         description:
//           service?.description ||
//           "Easy and reliable trademark registration and legal services.",
//         images: [service?.image || "/assets/brief_blue.png"],
//       },
//       robots: {
//         index: true,
//         follow: true,
//       },
//     };
//   } catch (err) {
//     return fallbackMetadata();
//   }
// }

// // ✅ API fail ஆனாலும் default meta காட்டும்
// function fallbackMetadata() {
//   return {
//     title: "Legal Services | Briefcasse",
//     description:
//       "Briefcasse offers easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses.",
//     openGraph: {
//       title: "Legal Services | Briefcasse",
//       description:
//         "Easy and reliable trademark registration and legal services.",
//       images: [{ url: "/assets/brief_blue.png" }],
//     },
//   };
// }

// // ✅ உங்கள் existing UI — எந்த மாற்றமும் இல்லை
// export default function ServiceSlugPage({ params }) {
//   return <ServiceSlugClient />;
// }


// app/services/[slug]/page.jsx

import ServiceSlugClient from "./ServiceSlugClient";

export async function generateMetadata({ params }) {
  // ✅ Next.js 15 fix
  const { slug } = await params;

  try {
    const res = await fetch(
      `https://brief-ewyr.onrender.com/api/services`,
      { cache: "no-store" }
    );

    if (!res.ok) return fallbackMetadata();

    const data = await res.json();
    const service = data?.items?.find((s) => s.slug === slug);

    if (!service) return fallbackMetadata();

    return {
      title: service?.heading || "Legal Service",
      description:
        service?.description ||
        `${service?.heading} — Reliable trademark & legal services by Briefcasse.`,
      alternates: {
        canonical: `/services/${slug}`,
      },
      openGraph: {
        type: "website",
        title: `${service?.heading || "Legal Service"} | Briefcasse`,
        description:
          service?.description ||
          "Easy and reliable trademark registration and legal services.",
        url: `https://www.briefcasse.com/services/${slug}`,
        siteName: "Briefcasse",
        images: [
          {
            url: service?.image || "/assets/brief_blue.png",
            width: 1200,
            height: 630,
            alt: service?.heading || "Briefcasse Legal Service",
          },
        ],
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: `${service?.heading || "Legal Service"} | Briefcasse`,
        description:
          service?.description ||
          "Easy and reliable trademark registration and legal services.",
        images: [service?.image || "/assets/brief_blue.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return fallbackMetadata();
  }
}

function fallbackMetadata() {
  return {
    title: "Legal Services | Briefcasse",
    description:
      "Briefcasse offers easy and reliable trademark registration and legal services.",
    openGraph: {
      title: "Legal Services | Briefcasse",
      images: [{ url: "/assets/brief_blue.png" }],
    },
  };
}

export default async function ServiceSlugPage({ params }) {
  // ✅ Next.js 15 fix
  const { slug } = await params;
  return <ServiceSlugClient />;
}