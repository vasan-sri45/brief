"use client";
import React from "react";
import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

const fallbackDocuments = [
  {
    title: "Documents Required",
    desc: "Both PAN and Aadhaar Card of all Indian Shareholders and Directors",
  },
  {
    title: "IDENTITY PROOF",
    desc: "Either Voter ID, Passport, or Driving License of the Shareholders and Directors.",
  },
  {
    title: "PROOF OF ADDRESS",
    desc: "Copy of the latest Telephone Bill, Electricity Bill, or Bank Account Statement of the Shareholders and Directors.",
  },
  {
    title: "PHOTOGRAPHS",
    desc: "Latest passport size photographs of all the Shareholders and Directors.",
  },
  {
    title: "BUSINESS ADDRESS PROOF",
    desc: "Either of the latest Utility Bill (Electricity, Telephone, Gas, Water) or Property Tax Bill of the registered office address. Rent agreement and NOC from the owner in case of rented property.",
  },
];

const DocumentsRequired = ({ docs, variant = "list" }) => {
  const items = docs && docs.length > 0 ? docs : fallbackDocuments;
  
  // 🎯 Heading animation hook
  const headingRef = useGsapSectionHeading(0.2);
   const underlineRef = useGsapUnderlineLoop();

  return (
    <section className="w-full pt-4 pb-3 lg:pt-12">
      <div className="w-full mx-auto p-2 md:p-4 lg:w-10/12 lg:p-0">
        {/* 🚀 Animated heading */}
        <div className="text-center">
          <h2 
            ref={headingRef}
            className="section-heading font-anton font-medium text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] text-custom-blue tracking-wider"
          >
            Documents Required
          </h2>
        
          <div className="mt-2 flex justify-center mb-6 overflow-hidden">
            <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
              {/* GSAP-driven infinite underline */}
              <span
                ref={underlineRef}
                className="underline-glow absolute inset-0 rounded-full bg-white/70"
              />
            </span>
          </div>
        </div>

        {variant === "list" ? (
          // bullet list
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {items.map((doc, idx) => (
              <li key={doc._id || doc.title || idx}>
                <span className="font-lato font-semibold">
                  {doc.name || doc.title}:
                </span>{" "}
                {doc.details || doc.desc}
              </li>
            ))}
          </ul>
        ) : (
          // stagger cards (works with parent useGsapScrollReveal)
          <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item, index) => (
              <div
                key={item._id || item.title || index}
                className="stagger-card flex flex-col 
                  rounded-2xl border border-[#D4D4D4]
                  bg-white
                  shadow-[0_6px_14px_rgba(0,0,0,0.12)]
                  px-5 py-4 min-h-[150px]
                  hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <h3 className="font-lato font-bold text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] text-custom-blue pb-2">
                  {item.name || item.title}
                </h3>
                <p className="text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] leading-5 text-letter1 font-semibold font-lato">
                  {item.details || item.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentsRequired;
