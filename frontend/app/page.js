

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

async function getServices() {
  try {
    const res = await fetch(
      "https://brief-ewyr.onrender.com/api/services",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.items || [];
  } catch {
    return [];
  }
}

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
  const services = await getServices();

  return (
    <>
      {/* ✅ Server-side HTML — Google படிக்கும் */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-5 pt-8 pb-2">

          <h1 className="font-anton text-2xl md:text-4xl text-custom-blue text-center tracking-wider mb-3">
            Trademark Registration & Legal Services India
          </h1>

          <p className="text-letter1 text-center text-base md:text-lg font-lato max-w-3xl mx-auto mb-6">
            Briefcasse offers easy and reliable trademark registration and legal
            services for startups, entrepreneurs, and businesses in India.
            Secure your brand with expert support.
          </p>

          {categories.map((cat) => {
            const filtered = services.filter(
              (s) => s.title?.trim().toLowerCase() === cat.title.trim().toLowerCase()
            );
            if (filtered.length === 0) return null;

            return (
              <div key={cat.title} className="mb-6">
                <h2 className="font-anton text-xl text-custom-blue text-center tracking-wider mb-1">
                  {cat.title}
                </h2>
                <p className="text-letter1 text-center text-sm font-lato mb-2">
                  {cat.subTitle}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {filtered.map((s) => (
                    <a
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="px-3 py-1 border border-custom-blue rounded-full text-sm text-custom-blue hover:bg-custom-blue hover:text-white transition font-lato"
                    >
                      {s.heading || s.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ✅ உங்கள் existing Home — எந்த மாற்றமும் இல்லை */}
      <Home />
    </>
  );
}