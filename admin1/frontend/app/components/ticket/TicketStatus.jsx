
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TicketsStatus = ({ activeKey, onSelect, stats }) => {
  const sliderRef = useRef(null);
  const cardRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 👉 Slide card to CENTER of viewport
  const slideTo = (index) => {
    const slider = sliderRef.current;
    const card = cardRefs.current[index];

    if (!slider || !card) return;

    const viewportWidth = window.innerWidth;
    const cardWidth = card.offsetWidth;
    const cardLeft = card.offsetLeft;

    const translateX =
      cardLeft - viewportWidth / 2 + cardWidth / 2;

    gsap.to(slider, {
      x: -translateX,
      duration: 0.5,
      ease: "power3.out",
    });

    setCurrentIndex(index);
    onSelect(stats[index].key);
  };

  // Initial centering on mount (mobile only)
  useEffect(() => {
    if (window.innerWidth < 768) {
      slideTo(currentIndex);
    }
  }, []);

  // Sync when activeKey changes externally
  useEffect(() => {
    const idx = stats.findIndex((s) => s.key === activeKey);
    if (idx !== -1 && idx !== currentIndex && window.innerWidth < 768) {
      slideTo(idx);
    }
  }, [activeKey]);

  const next = () => {
    if (currentIndex < stats.length - 1) {
      slideTo(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      slideTo(currentIndex - 1);
    }
  };

  return (
    <section className="w-full px-4 lg:px-0 lg:w-10/12 mx-auto mt-8">
      <h2 className="text-custom-blue font-poppins text-[1.2rem] md:text-[1.4rem] font-semibold">
        Raised Tickets & Status
      </h2>

      <p className="text-custom-blue mt-1 text-sm max-w-3xl font-poppins">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      {/* ================= DESKTOP GRID ================= */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8 mt-5">
        {stats.map((item) => {
          const isActive = activeKey === item.key;

          return (
            <div
              key={item.key}
              className={`${item.bg} rounded-3xl px-8 py-6 shadow-[0_10px_20px_rgba(0,0,0,0.12)] relative`}
            >
              <span
                className={`absolute top-6 right-6 w-4 h-4 rounded-full ${
                  isActive
                    ? "bg-[#E6B566]"
                    : "border-2 border-custom-blue"
                }`}
              />

              <p className="text-custom-blue font-poppins text-sm font-semibold">
                {item.title}
              </p>

              <h3 className="text-custom-blue font-poppins text-[2.8rem] font-bold mt-6">
                {item.value}
              </h3>

              <button
                onClick={() => onSelect(item.key)}
                className={`mt-6 bg-white text-custom-blue font-medium px-8 py-2 rounded-full shadow transition ${
                  isActive
                    ? "scale-105 ring-2 ring-[#E6B566]"
                    : "hover:scale-105"
                }`}
              >
                Check
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= MOBILE CAROUSEL ================= */}
      <div className="md:hidden mt-6 relative">
        {/* Prev button */}
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10
            bg-white shadow rounded-full p-2 transition
            ${currentIndex === 0 ? "opacity-40" : ""}`}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next button */}
        <button
          onClick={next}
          disabled={currentIndex === stats.length - 1}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10
            bg-white shadow rounded-full p-2 transition
            ${currentIndex === stats.length - 1 ? "opacity-40" : ""}`}
        >
          <ChevronRight size={22} />
        </button>

        {/* Slider */}
        <div className="overflow-hidden relative">
          <div
            ref={sliderRef}
            className="flex gap-6 will-change-transform"
          >
            {stats.map((item, index) => {
              const isActive = index === currentIndex;

              return (
                <div
                  key={item.key}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`${item.bg} min-w-[80%]
                    rounded-3xl px-8 py-6
                    shadow-[0_10px_20px_rgba(0,0,0,0.12)]
                    transition-transform duration-300
                    ${isActive ? "scale-105" : "scale-95"}`}
                >
                  <p className="text-custom-blue font-poppins text-sm font-semibold">
                    {item.title}
                  </p>

                  <h3 className="text-custom-blue font-poppins text-[2.6rem] font-bold mt-6">
                    {item.value}
                  </h3>

                  <button
                    onClick={() => slideTo(index)}
                    className="mt-6 bg-white text-custom-blue font-medium px-8 py-2 rounded-full shadow"
                  >
                    Check
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TicketsStatus;
