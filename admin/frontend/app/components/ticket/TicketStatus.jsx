"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TicketsStatus = ({
  activeKey,
  onSelect,
  stats,
}) => {

  const sliderRef = useRef(null);

  const cardRefs = useRef([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  // =========================================
  // CENTER SLIDER
  // =========================================

  const slideTo = (index) => {

    const slider =
      sliderRef.current;

    const card =
      cardRefs.current[index];

    if (!slider || !card) return;

    // PARENT CONTAINER
    const container =
      slider.parentElement;

    const containerWidth =
      container.offsetWidth;

    const cardWidth =
      card.offsetWidth;

    const cardLeft =
      card.offsetLeft;

    // PERFECT CENTER
    const translateX =
      cardLeft -
      (containerWidth / 2 -
        cardWidth / 2);

    gsap.to(slider, {
      x: -translateX,
      duration: 0.5,
      ease: "power3.out",
    });

    setCurrentIndex(index);

    onSelect(stats[index].key);
  };

  // =========================================
  // INITIAL CENTER
  // =========================================

  useEffect(() => {

    if (
      window.innerWidth < 768
    ) {
      slideTo(currentIndex);
    }

  }, []);

  // =========================================
  // SYNC ACTIVE KEY
  // =========================================

  useEffect(() => {

    const idx = stats.findIndex(
      (s) => s.key === activeKey
    );

    if (
      idx !== -1 &&
      idx !== currentIndex &&
      window.innerWidth < 768
    ) {
      slideTo(idx);
    }

  }, [activeKey]);

  // =========================================
  // NEXT
  // =========================================

  const next = () => {

    if (
      currentIndex <
      stats.length - 1
    ) {
      slideTo(currentIndex + 1);
    }
  };

  // =========================================
  // PREVIOUS
  // =========================================

  const prev = () => {

    if (currentIndex > 0) {
      slideTo(currentIndex - 1);
    }
  };

  return (
    <section className="w-full px-4 lg:px-0 lg:w-11/12 mx-auto mt-8">

      {/* HEADER */}
      <div>

        <h2 className="text-custom-blue font-poppins text-[1.2rem] md:text-[1.4rem] font-semibold">
          Raised Tickets & Status
        </h2>

        <p className="text-custom-blue/70 mt-1 text-sm max-w-3xl font-poppins">
          Track and manage all your support tickets with real-time status updates.
        </p>

      </div>

      {/* ========================================= */}
      {/* DESKTOP GRID */}
      {/* ========================================= */}

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6 mt-6">

        {stats.map((item) => {

          const isActive =
            activeKey === item.key;

          return (
            <div
              key={item.key}
              className={`
                ${item.bg}
                rounded-3xl
                px-6 py-6
                shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                border border-white/40
                relative
                overflow-hidden
                transition-all duration-300
                ${
                  isActive
                    ? "scale-[1.03] ring-2 ring-[#E6B566]"
                    : "hover:scale-[1.02]"
                }
              `}
            >

              {/* TOP DOT */}
              <span
                className={`
                  absolute top-5 right-5
                  w-4 h-4 rounded-full
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#E6B566]"
                      : "border-2 border-custom-blue"
                  }
                `}
              />

              {/* TITLE */}
              <p className="text-custom-blue font-poppins text-sm font-semibold">
                {item.title}
              </p>

              {/* VALUE */}
              <h3 className="text-custom-blue font-poppins text-[2.8rem] font-bold mt-6">
                {item.value}
              </h3>

              {/* BUTTON */}
              <button
                onClick={() =>
                  onSelect(item.key)
                }
                className={`
                  mt-6
                  bg-white
                  text-custom-blue
                  font-medium
                  px-7 py-2.5
                  rounded-full
                  shadow-md
                  transition-all duration-300
                  ${
                    isActive
                      ? "ring-2 ring-[#E6B566]"
                      : "hover:scale-105"
                  }
                `}
              >
                Check
              </button>

            </div>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* MOBILE CAROUSEL */}
      {/* ========================================= */}

      <div className="md:hidden mt-6 relative">

        {/* PREV */}
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className={`
            absolute left-1 top-1/2 -translate-y-1/2 z-20
            bg-white/90 backdrop-blur-md
            shadow-lg rounded-full p-2.5
            transition-all duration-300
            ${
              currentIndex === 0
                ? "opacity-40"
                : "hover:scale-110"
            }
          `}
        >
          <ChevronLeft size={22} />
        </button>

        {/* NEXT */}
        <button
          onClick={next}
          disabled={
            currentIndex ===
            stats.length - 1
          }
          className={`
            absolute right-1 top-1/2 -translate-y-1/2 z-20
            bg-white/90 backdrop-blur-md
            shadow-lg rounded-full p-2.5
            transition-all duration-300
            ${
              currentIndex ===
              stats.length - 1
                ? "opacity-40"
                : "hover:scale-110"
            }
          `}
        >
          <ChevronRight size={22} />
        </button>

        {/* SLIDER */}
        <div className="overflow-hidden relative py-2">

          <div
            ref={sliderRef}
            className="flex gap-5 px-[10%] will-change-transform"
          >

            {stats.map(
              (item, index) => {

                const isActive =
                  index === currentIndex;

                return (
                  <div
                    key={item.key}
                    ref={(el) =>
                      (cardRefs.current[index] =
                        el)
                    }
                    className={`
                      ${item.bg}
                      min-w-[80%]
                      rounded-3xl
                      px-6 py-6
                      shadow-[0_10px_30px_rgba(15,23,42,0.10)]
                      relative
                      overflow-hidden
                      transition-all duration-300
                      ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-80"
                      }
                    `}
                  >

                    {/* ACTIVE DOT */}
                    <span
                      className={`
                        absolute top-5 right-5
                        w-4 h-4 rounded-full
                        ${
                          isActive
                            ? "bg-[#E6B566]"
                            : "border-2 border-custom-blue"
                        }
                      `}
                    />

                    {/* TITLE */}
                    <p className="text-custom-blue font-poppins text-sm font-semibold">
                      {item.title}
                    </p>

                    {/* VALUE */}
                    <h3 className="text-custom-blue font-poppins text-[2.5rem] font-bold mt-6">
                      {item.value}
                    </h3>

                    {/* BUTTON */}
                    <button
                      onClick={() =>
                        slideTo(index)
                      }
                      className={`
                        mt-6
                        bg-white
                        text-custom-blue
                        font-medium
                        px-7 py-2.5
                        rounded-full
                        shadow-md
                        transition-all duration-300
                        ${
                          isActive
                            ? "ring-2 ring-[#E6B566]"
                            : ""
                        }
                      `}
                    >
                      Check
                    </button>

                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* INDICATORS */}
        <div className="flex items-center justify-center gap-2 mt-5">

          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() =>
                slideTo(index)
              }
              className={`
                transition-all duration-300 rounded-full
                ${
                  currentIndex === index
                    ? "w-8 h-2 bg-custom-blue"
                    : "w-2 h-2 bg-gray-300"
                }
              `}
            />
          ))}

        </div>
      </div>
    </section>
  );
};

export default TicketsStatus;