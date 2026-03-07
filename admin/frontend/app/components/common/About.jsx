"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="bg-white py-12 md:py-16 px-4 sm:px-6 md:px-12">
      <div className="w-full mx-auto md:p-4 lg:w-10/12 lg:p-0">

        {/* ================= TITLE ================= */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-anton tracking-wider text-blue-600 mb-6 md:mb-10">
          ABOUT US
        </h2>

        {/* ================= HEADER TEXT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-10">
          <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin 
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
            in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the 
            cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 
            "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. 
            This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
            comes from a line in section 1.10.32.
          </p>

          <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin 
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
            in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the 
            cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 
            "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. 
            This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
            comes from a line in section 1.10.32.
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
               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin 
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
            in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the 
            cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 
            "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. 
            This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
            comes from a line in section 1.10.32.
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
               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin 
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
            in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the 
            cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 
            "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. 
            This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
            comes from a line in section 1.10.32.
          </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <h3 className="font-anton text-custom-blue text-lg md:text-xl tracking-wider min-w-[140px]">
              Our Vision
            </h3>
             <p className="text-letter1 font-lato font-bold text-sm leading-relaxed text-justify tracking-wide">
               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin 
            literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College
            in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the 
            cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 
            "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. 
            This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
            comes from a line in section 1.10.32.
          </p>
          </div>

        </div>

      </div>
    </section>
  );
}
