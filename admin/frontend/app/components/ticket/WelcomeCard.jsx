"use client";

import React from "react";

const WelcomeCard = ({
  name = "John Doe",
  code = "EMP-1023",
}) => {
  return (
    <div
      className="
        w-full mx-auto bg-white rounded-2xl
        shadow-[0_6px_18px_rgba(0,0,0,0.18)]
        p-6 sm:p-7 md:p-6 lg:p-8
        lg:w-10/12
      "
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

        {/* Avatar + Name */}
        <div className="flex flex-col items-center gap-4 min-w-[160px]">
          <img
            src="https://m.media-amazon.com/images/I/71qb1LEtHdL._AC_UF894,1000_QL80_.jpg"
            alt="Profile"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-inner"
          />

          <div className="text-center leading-snug">
            <p className="font-poppins font-bold text-custom-blue text-[0.9rem] sm:text-[1rem]">
              {name}
            </p>
            <p className="font-poppins font-bold text-custom-blue text-[0.75rem] sm:text-[0.85rem]">
              {code}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="
            w-full h-[1.5px] bg-custom-blue
            my-4 sm:my-5
            md:my-0 md:w-[2.5px] md:h-24
          "
        />

        {/* Greeting */}
        <div
          className="
            flex flex-col items-center md:items-start
            text-center md:text-left
            px-1 py-2 sm:py-3
          "
        >
          <h2
            className="
              font-bold font-poppins text-custom-blue
              text-[1.05rem] sm:text-[1.2rem]
              md:text-[1.4rem] lg:text-[2.4rem]
            "
          >
            Great to see you here!
          </h2>

          <p
            className="
              font-semibold font-poppins text-lightYelow
              mt-2 leading-relaxed
              text-[0.85rem] sm:text-[0.95rem]
              md:text-[1.05rem] lg:text-[1.3rem]
            "
          >
            Let’s make today productive and meaningful.
          </p>
        </div>

      </div>
    </div>
  );
};

export default WelcomeCard;
