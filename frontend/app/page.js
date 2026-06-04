

// import React from 'react';
// import Home from "./components/common/Home";

// const page = () => {
//   return (
//     <>
//       <Home />
//     </>
//   )
// }

// export default page


// app/page.js

import Home from "./components/common/Home";
import { SERVICES } from "./config/services";

const categories = [
  { title: "Startup", subTitle: "We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease." },
  { title: "Intellectual Property", subTitle: "We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively." },
  { title: "Tax Filing", subTitle: "We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free." },
  { title: "MCA Compliance", subTitle: "We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly." },
  { title: "Registration", subTitle: "We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence." },
  { title: "Legal Advisory & Agreement", subTitle: "We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships." },
  { title: "Other Services", subTitle: "We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs." },
];

// ✅ async function — Server Component
export default async function Page() {
  const services = SERVICES;

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <h1>Trademark Registration & Legal Services India</h1>
        <p>Briefcasse offers easy and reliable trademark registration and legal services for startups, entrepreneurs, and businesses in India.</p>
        {categories.map((cat) => {
          const filtered = services.filter((s) => {
            const category = (s.category || s.title || "").trim().toLowerCase();
            return category === cat.title.trim().toLowerCase();
          });
          if (filtered.length === 0) return null;
          return (
            <div key={cat.title}>
              <h2>{cat.title}</h2>
              <p>{cat.subTitle}</p>
              <ul>
                {filtered.map((s) => (
                  <li key={s.slug}>
                    <a href={`/services/${s.slug}`}>
                      {s.heading || s.name || s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ✅ உங்கள் existing Home — எந்த மாற்றமும் இல்லை */}
      <Home />
    </>
  );
}
