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
    <div
      className="relative mb-16 mt-5 overflow-hidden rounded-[42px] p-5 md:p-10"
      style={{
        background: "#FFF7C7",
        border: "1px solid #FFD94E",
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#D4A700 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT DOG SECTION */}
        <div className="relative flex justify-center items-center min-h-[430px] overflow-hidden">
          <div
            className="absolute top-4 left-2 z-20 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg md:left-6"
            style={{
              border: "1px solid #FFD94E",
              color: "#9A7400",
            }}
          >
            GST Registration
          </div>

          <div
            className="absolute right-0 top-24 z-20 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg md:right-6"
            style={{
              border: "1px solid #FFD94E",
              color: "#9A7400",
            }}
          >
            Company Setup
          </div>

          <div
            className="absolute bottom-24 left-0 z-20 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg md:left-8"
            style={{
              border: "1px solid #FFD94E",
              color: "#9A7400",
            }}
          >
            Legal Support
          </div>

          <div
            className="absolute bottom-6 right-4 z-20 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg"
            style={{
              border: "1px solid #FFD94E",
              color: "#9A7400",
            }}
          >
            Compliance
          </div>

          <div
            className="absolute h-[320px] w-[320px] rounded-full opacity-80 blur-sm md:h-[420px] md:w-[420px]"
            style={{
              background: "linear-gradient(135deg, #FFD94E, #FFE680, #FFF7C7)",
            }}
          />

          <div
            className="absolute h-[290px] w-[290px] rounded-full border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl md:h-[390px] md:w-[390px]"
          />

          <img
            src="/assets/Dog_Home.png"
            alt="Dog Assistant"
            className="relative z-10 w-[330px] md:w-[480px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div
          className="rounded-[36px] bg-white p-6 shadow-xl md:p-9"
          style={{
            border: "1px solid #FFE680",
          }}
        >
          <span
            className="mb-5 inline-block rounded-full px-4 py-2 text-sm font-bold text-black"
            style={{
              background: "#FFD94E",
            }}
          >
            Briefcasse Buddy
          </span>

          <div
            className={`transition-all duration-300 ${
              blink ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <h2
              className="mb-5 text-4xl leading-tight md:text-4xl"
              style={{
                color: "#375DD8",
                fontWeight: 900,
              }}
            >
              Why Choose Briefcasse?
            </h2>

            <p className="text-base leading-8 text-gray-700 md:text-lg">
              {heroMessages[currentMessage]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div
              className="rounded-2xl p-5 transition-transform duration-300 hover:scale-105"
              style={{
                background: "#FFF7C7",
                border: "1px solid #FFD94E",
              }}
            >
              <p className="text-3xl font-bold" style={{ color: "#D4A700" }}>
                80+
              </p>
              <p className="text-sm text-gray-600 mt-1">Business Services</p>
            </div>

            <div
              className="rounded-2xl p-5 transition-transform duration-300 hover:scale-105"
              style={{
                background: "#FFF7C7",
                border: "1px solid #FFD94E",
              }}
            >
              <p className="text-3xl font-bold" style={{ color: "#D4A700" }}>
                24/7
              </p>
              <p className="text-sm text-gray-600 mt-1">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
