"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    name: "Priya Raman",
    role: "Founder, Chennai",
    text: "Briefcasse made our company registration feel simple. The team explained every document clearly and kept the process moving.",
  },
  {
    name: "Arjun Mehta",
    role: "Small Business Owner",
    text: "Fast, practical support for GST and compliance. I liked that the updates were clear and I never had to chase for next steps.",
  },
  {
    name: "Nisha Varghese",
    role: "Brand Owner",
    text: "The trademark guidance was crisp and reliable. They helped us avoid confusion and file with confidence.",
  },
  {
    name: "Karthik S",
    role: "Startup Operator",
    text: "Professional, responsive, and easy to work with. The legal checklist was handled neatly from start to finish.",
  },
];

export default function ReviewCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % reviews.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const visibleReviews = useMemo(
    () =>
      [0, 1, 2].map((offset) => reviews[(active + offset) % reviews.length]),
    [active]
  );

  const goToPrevious = () => {
    setActive((current) => (current - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setActive((current) => (current + 1) % reviews.length);
  };

  return (
    <section className="my-16 overflow-hidden bg-[#F7FAFF] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-anton text-2xl font-semibold tracking-wider text-custom-blue md:text-3xl">
              Client Reviews
            </p>
            <p className="mt-2 max-w-2xl font-lato text-base font-bold leading-7 text-letter1">
              Lightweight local feedback from founders and business owners who
              trust Briefcasse for legal, tax, and compliance support.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-full border border-custom-blue text-custom-blue transition hover:bg-custom-blue hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-full border border-custom-blue text-custom-blue transition hover:bg-custom-blue hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {visibleReviews.map((review, index) => (
            <article
              key={`${review.name}-${active}-${index}`}
              className="min-h-[260px] border border-custom-blue/15 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex gap-1 text-[#FFD94E]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="font-lato text-sm font-bold leading-7 text-letter1 md:text-base">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-6 border-t border-custom-blue/10 pt-4">
                <p className="font-lato text-base font-extrabold text-custom-blue">
                  {review.name}
                </p>
                <p className="mt-1 font-lato text-sm font-bold text-letter1">
                  {review.role}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show review ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                active === index
                  ? "w-8 bg-custom-blue"
                  : "w-2.5 bg-custom-blue/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
