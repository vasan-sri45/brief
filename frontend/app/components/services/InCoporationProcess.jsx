"use client";
import React from "react";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

const fallbackSteps = [
  {
    badge: "01",
    days: "Days 1 - 2",
    title: "",
    points: [
      "Experts review your documents and information",
      "Apply for Digital Signature Certificate",
    ],
  },
  {
    badge: "02",
    days: "Days 3 - 6",
    title: "",
    points: [
      "Name availability check on MCA and IP India Portals",
      "Apply for Company Name Reservation",
      "MoA and AoA drafting",
    ],
  },
  {
    badge: "03",
    days: "Days 7 - 9",
    title: "",
    points: [
      "Form filing for Certificate of Incorporation (COI)",
      "DIN Allotment Application",
      "PAN and TAN Application",
    ],
  },
  {
    badge: "04",
    days: "Day 10 - 12",
    title: "",
    points: ["Awaiting MCA approval"],
  },
];

const IncorporationProcess = ({ process }) => {

  const underlineRef = useGsapUnderlineLoop();
  const items =
    process && process.length > 0
      ? process.map((s, idx) => ({
          badge: String(idx + 1).padStart(2, "0"),
          days: s.days || "",
          title: s.title || "",
          points: s.details ? [s.details] : [],
        }))
      : fallbackSteps;

  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <section className="w-full pt-4 pb-3 lg:pt-12">
      <div className="w-full mx-auto px-2 lg:w-10/12 lg:px-0">
        {/* heading */}
        <div className="text-left pb-1 md:pb-10">
          <h2 className="font-anton font-medium text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] tracking-wider text-custom-blue">
            INCORPORATION PROCESS
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

        {/* grid: 1 col on mobile, 2 cols + divider from md */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6 md:max-w-5xl mx-auto px-2">
          {/* left column */}
          <div>
            {leftItems.map((step) => (
              <ProcessCard key={step.badge} step={step} />
            ))}
          </div>

          {/* vertical divider – md and up */}
          <div className="hidden md:flex justify-center">
            <div className="w-px px-0.5 bg-custom-blue h-full" />
          </div>

          {/* right column */}
          <div>
            {rightItems.map((step) => (
              <ProcessCard key={step.badge} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessCard = ({ step }) => {
  return (
    <div className="relative flex justify-center mt-6">
      {/* badge circle */}
      <div className="absolute -top-4 left-[-9px] w-9 h-9 md:w-10 md:h-10 rounded-full bg-starttext text-white flex items-center justify-center shadow-[0_6px_12px_rgba(0,0,0,0.16)] border border-white z-10">
        <span className="font-poppins font-semibold text-xs md:text-sm">
          {step.badge}
        </span>
      </div>

      {/* main card */}
      <div
        className="
          w-full
          rounded-[18px] bg-white
          border border-[#D4D4D4]
          shadow-[0_8px_18px_rgba(0,0,0,0.12)]
          px-5 pt-7 pb-4 md:pt-8 md:pb-5 lg:px-6
          min-h-[140px]
        "
      >
        {step.days && (
          <p className="font-lato font-semibold text-[0.9rem] md:text-[1rem] lg:text-[1.1rem] text-custom-blue mb-2">
            {step.days}
          </p>
        )}

        <ul className="text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] leading-5 text-letter1 font-semibold space-y-1 font-lato text-justify">
          {step.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default IncorporationProcess;

