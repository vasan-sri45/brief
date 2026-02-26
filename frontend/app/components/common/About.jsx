"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="bg-white py-12 md:py-16 px-4 sm:px-6 md:px-12">
      <div className="w-full mx-auto md:p-4 lg:w-10/12 lg:p-0">

        {/* ================= TITLE ================= */}
        <h2 className="text-xl md:text-3xl font-anton tracking-wider text-blue-600 mb-6">
          About Briefcasse
        </h2>

        {/* ================= HEADER TEXT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-10">
          <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               Briefcasse is a professional services platform offering legal, tax, and compliance solutions for individuals,
              startups, and businesses. We aim to simplify complex regulatory processes through expert guidance and reliable support.<br></br><br></br>
              Our team of experienced lawyers, chartered accountants, and company secretaries work together to deliver accurate, timely,
               and practical solutions tailored to your needs. We focus on clarity, transparency, and professionalism in every service
               we provide.
          </p>

          <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
             From business registrations and tax filing to legal agreements and corporate compliance,
              Briefcasse serves as a one-stop destination for essential business and legal services.<br></br><br></br>
              We believe in building long-term relationships with our clients by providing dependable 
              support that helps them grow confidently and stay compliant.
          </p>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="w-full mb-10">
          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[450px] rounded overflow-hidden">
            <img
              src="https://img.freepik.com/free-photo/corporate-businessman-giving-presentation-large-audience_53876-101865.jpg?semt=ais_user_personalization&w=740&q=80"
              alt="Team"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="mb-12">
          <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               Briefcasse is a professional services platform offering legal, tax, and compliance solutions for individuals,
                startups, and growing businesses. Our objective is to simplify complex regulatory procedures and provide clear
                 guidance so clients can focus on their core activities without confusion or delay.<br></br><br></br>
                 Our team consists of experienced lawyers, chartered accountants, and company secretaries who work together
                  to deliver accurate and practical support. By combining expertise across multiple professional areas, we
                   ensure clients receive complete solutions rather than fragmented advice. Every service is handled with transparency,
                    structured processes, and timely communication.
          </p>
        </div>

        {/* ================= MISSION & VISION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Mission */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <h3 className="font-anton text-custom-blue text-lg md:text-xl tracking-wider min-w-[140px]">
              Our Mission
            </h3>
            <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               To deliver accessible, reliable, and technology-driven legal and compliance services that simplify business
                operations and empower growth.
          </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <h3 className="font-anton text-custom-blue text-lg md:text-xl tracking-wider min-w-[140px]">
              Our Vision
            </h3>
             <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               To become a trusted and leading professional services platform known for excellence, integrity, and
                client-focused solutions.
          </p>
          </div>

        </div>

      </div>
    </section>
  );
}
