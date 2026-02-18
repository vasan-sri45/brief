"use client";
import React from "react";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

const defaultSteps = [
  {
    badge: "01",
    title: "1. Answer Quick Questions",
    lines: [
      "Pick the most suitable package.",
      "Take 5-10 mins to answer simple questions.",
      "Provide payment proof or use the enclave.",
      "Initiate the process through a secured payment gateway.",
    ],
  },
  {
    badge: "02",
    title: "2. Experts at Your Service",
    lines: [
      "We will assign a Relationship Manager.",
      "Relax while experts draft and file your documents.",
      "Any queries addressed within 24 business hours.",
    ],
  },
  {
    badge: "03",
    title: "3. You are All Set to Sail",
    lines: [
      "It takes 8-12 working days.",
      "Get your business compliant and operational.",
      "All done at one convenient cost.",
    ],
  },
];

const ProcessAtBriefcase = ({ brief }) => {
  const underlineRef = useGsapUnderlineLoop();
  const steps =
    brief && brief.length > 0
      ? brief.map((b, idx) => ({
          badge: String(idx + 1).padStart(2, "0"),
          title: b.title || defaultSteps[idx]?.title || "",
          lines: Array.isArray(b.lines)
            ? b.lines
            : b.details
            ? [b.details]
            : [],
        }))
      : defaultSteps;

  return (
    <section className="relative w-full py-12 md:py-16 overflow-hidden px-2">
      {/* background circles */}
      <div className="pointer-events-none absolute -left-24 top-30 w-52 h-52 rounded-full bg-[#143C63]" />
      <div className="hidden lg:block pointer-events-none absolute -left-10 top-20 w-40 h-40 rounded-full border-[6px] border-[#E3A849]" />
      <div className="pointer-events-none absolute left-1/3 top-40 w-40 h-40 rounded-full bg-[#143C63]" />
      <div className="pointer-events-none absolute left-[38%] top-32 w-24 h-24 rounded-full border-[5px] border-[#E3A849]/70" />
      <div className="pointer-events-none absolute right-12 bottom-10 w-32 h-32 rounded-full border-[5px] border-[#E3A849]/60" />

      <div className="mb-8 lg:w-10/12 mx-auto">
          <h2 className="font-anton font-medium text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] tracking-wider text-custom-blue">
            PROCESS AT BRIEFCASE
          </h2>
          {/* <div className="mt-1 h-1 w-16 bg-[#C58E3B]" /> */}
          <div className="mt-1 h-1 w-16 bg-transparent relative overflow-hidden">
  {/* base line */}
            <span className="absolute inset-y-0 left-0 w-full bg-custom-blue" />
            {/* moving underline */}
            <span
              ref={underlineRef}
              className="absolute inset-y-0 left-0 w-8 rounded-full bg-white/70"
            />
         </div>
        </div>
      <div className="relative w-full px-4 md:px-8 lg:w-10/12 mx-auto">

        <div className="flex flex-col items-stretch gap-6 md:gap-10">
          {steps.map((step, index) => (
            <ProcessCard key={step.badge} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ step, index }) => {
  const alignClass =
    index === 0
      ? "md:self-start"
      : index === 1
      ? "md:self-center"
      : "md:self-end";

  return (
    <div className={`relative w-full md:w-3/4 lg:w-2/4 ${alignClass}`}>
      <div
        className="
          absolute -left-4 md:-left-6 -top-5
          w-11 h-11 rounded-full
          bg-starttext flex items-center justify-center
          text-[11px] md:text-[12px] font-semibold font-poppins text-white
          shadow-[0_4px_10px_rgba(0,0,0,0.25)]
        "
      >
        {step.badge}
      </div>

      <div
        className="
          rounded-[18px] bg-white
          border border-[#E2E2E2]
          shadow-[0_12px_24px_rgba(0,0,0,0.15)]
          px-6 md:px-8 py-5 md:py-6
        "
      >
        <h3 className="font-lato font-semibold text-[15px] md:text-[1.2rem] text-custom-blue mb-2 md:mb-3">
          {step.title}
        </h3>
        <ul className="text-[12px] md:text-[13px] text-letter1 leading-relaxed space-y-1.5">
          {step.lines.map((line, i) => (
            <li key={i} className="text-justify font-lato text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem]  font-semibold">{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProcessAtBriefcase;
