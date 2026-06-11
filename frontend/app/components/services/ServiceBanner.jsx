"use client";

import { useEffect, useState } from "react";

const heroMessages = [
  "Briefcasse offers simple, fast, and reliable business registration and compliance services across India. We help startups and businesses with company registration, GST, trademark, legal, and tax support at affordable pricing. Our team provides professional guidance and hassle-free service for all your business needs. Choose Briefcasse for trusted, smooth, and easy business solutions.",

  "Briefcasse offers simple and reliable business registration services for startups and entrepreneurs in India. We help with company formation, legal documentation, and compliance support at affordable pricing. Our team ensures a smooth and quick registration process for your business needs. Trust Briefcasse for professional and hassle-free business solutions.",
];

export default function HomeHeroSection() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);

      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % heroMessages.length);
        setBlink(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-16 mt-5 overflow-hidden rounded-[42px] bg-[#FFF7C7] border border-[#FFD94E] p-5 md:p-10">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D4A700_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT DOG SECTION */}
        <div className="relative flex justify-center items-center min-h-[430px] overflow-hidden">
          <div className="absolute top-4 left-2 md:left-6 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
            GST Registration
          </div>

          <div className="absolute top-24 right-0 md:right-6 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
            Company Setup
          </div>

          <div className="absolute bottom-24 left-0 md:left-8 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
            Legal Support
          </div>

          <div className="absolute bottom-6 right-4 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
            Compliance
          </div>

          <div className="absolute w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-[#FFD94E] via-[#FFE680] to-[#FFF7C7] opacity-80 blur-sm" />

          <div className="absolute w-[290px] h-[290px] md:w-[390px] md:h-[390px] bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-2xl" />

          <img
            src="/assets/Dog_Home.png"
            alt="Dog Assistant"
            className="relative z-10 w-[330px] md:w-[480px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="bg-white rounded-[36px] p-6 md:p-9 shadow-xl border border-[#FFE680]">
          <span className="inline-block bg-[#FFD94E] text-black font-bold px-4 py-2 rounded-full text-sm mb-5">
            🐾 Briefcasse Buddy
          </span>

          <div
            className={`transition-all duration-300 ${
              blink ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <h2 className="text-4xl md:text-4xl font-anton text-[#375DD8] mb-5 leading-tight">
              Why Choose Briefcasse?
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-8">
              {heroMessages[currentMessage]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#FFF7C7] rounded-2xl p-5 border border-[#FFD94E] hover:scale-105 transition-transform duration-300">
              <p className="text-3xl font-bold text-[#D4A700]">80+</p>
              <p className="text-sm text-gray-600 mt-1">Business Services</p>
            </div>

            <div className="bg-[#FFF7C7] rounded-2xl p-5 border border-[#FFD94E] hover:scale-105 transition-transform duration-300">
              <p className="text-3xl font-bold text-[#D4A700]">24/7</p>
              <p className="text-sm text-gray-600 mt-1">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}