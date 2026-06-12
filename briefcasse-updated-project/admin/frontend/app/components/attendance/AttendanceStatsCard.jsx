"use client";

import React from "react";

const AttendanceStatsCards = ({
  cards,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      {cards.map((card) => {

        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`
              bg-white
              border border-gray-100
              ${card.border}
              border-b-4
              rounded-3xl
              p-6
              
            `}
          >

            <div className="flex items-center gap-5">

              <div
                className={`
                  w-16 h-16
                  rounded-2xl
                  ${card.bg}
                  flex items-center justify-center
                `}
              >
                <Icon
                  size={34}
                  className={card.text}
                />
              </div>

              <div>

                <h3 className="text-gray-500 font-semibold text-sm">
                  {card.title}
                </h3>

                <p
                  className={`
                    text-4xl font-bold mt-1
                    ${card.text}
                  `}
                >
                  {card.value}
                </p>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStatsCards;