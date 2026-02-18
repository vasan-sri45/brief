// components/ClassGrid/index.js
"use client";
import React from "react";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

const ClassGrid = ({trade}) => {

  const underlineRef = useGsapUnderlineLoop();
  console.log(trade)
  return (
    <section className="w-full bg-white py-10 mt-0 md:mt-16">
      <div className="w-11/12 mx-auto lg:w-10/12">

          <div className="mb-8  mx-auto">
          <h2 className="font-anton font-medium text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] tracking-wider text-custom-blue uppercase text-center">
            Trademark Research
          </h2>
         
          <div className="mt-1 h-1 w-16 bg-transparent relative overflow-hidden mx-auto">
  {/* base line */}
            <span className="absolute inset-y-0 left-0 w-full bg-custom-blue" />
            {/* moving underline */}
            <span
              ref={underlineRef}
              className="absolute inset-y-0 left-0 w-8 rounded-full bg-white/70"
            />
         </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {trade.map((item,i) => (
  <div
    key={i}
    className="
      group
      w-full text-center rounded-2xl px-4 py-5 shadow-md border font-poppins
      bg-white text-letter1 border-gray-200
      transition-all duration-200
      hover:bg-starttext hover:border-starttext
    "
  >
    <p
      className="
        text-sm md:text-[1rem] font-anton font-normal tracking-wider
        text-custom-blue
        group-hover:text-white
      "
    >
      {item.name}
    </p>
    <p
      className="
        text-md mt-1
        text-letter1
        font-lato
        font-bold
        group-hover:text-white
      "
    >
      {item.details}
    </p>
  </div>
))}

        </div>
      </div>
    </section>
  );
};

export default ClassGrid;
