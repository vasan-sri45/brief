// "use client";
// import CardSwipper from "../components/services/CardSwipper";
// import { useAuthGuard } from "../components/route/useAuthGuard";
// import { useAllServices } from "../hooks/userServiceList";

// export default function ServicePage() {
//   const { loading: authLoading } = useAuthGuard(["user"]);

//   const {
//     data: servicesData,
//     isLoading,
//     error,
//   } = useAllServices();

//   const services = servicesData?.items || [];

//   if (authLoading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading services...
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center py-20 text-red-500">Failed to load services</div>;
//   }

//   return (
//     <section className="bg-white">
//       <div className="max-w-7xl mx-auto p-5">
//         <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease.</p> */}
//           <Section title="Startup"
//           subTitle="We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease."
//           services={services} />
//         </div>
//         <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively.</p> */}
//           <Section title="Intellectual Property"
//           subTitle="We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively."
//           services={services} />
//         </div>
//         <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free.</p> */}
//           <Section title="Tax Filing"
//             subTitle="We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free."
//           services={services} />
//         </div>
//         <div>
//           {/* <p>We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly.</p> */}
//           <Section title="MCA Compliance"
//           subTitle="We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly."
//           services={services} />
//         </div>
//         <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence.</p> */}
//           <Section title="Registration"
//           subTitle="We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence."
//           services={services} />
//         </div>
//         <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships.</p> */}
//           <Section title="Legal Advisory & Agreement"
//           subTitle="We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships."
//           services={services} />
//         </div>
//        <div>
//           {/* <p className="text-letter1 text-bold text-lato text-lg">We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs.</p> */}
//           <Section title="Other Services"
//           subTitle="We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs."
//           services={services} />
//        </div>
//       </div>
//     </section>
//   );
// }


// function Section({ title ,subTitle, services }) {

//   // ⭐ MAIN FIX
//   const filtered = services.filter(
//     (s) => s.title?.trim().toLowerCase() === title.trim().toLowerCase()
//   );

//   return (
//     <div className="mb-12">

//       <div className="pb-8 text-center">
//         <p className="font-anton font-semibold text-custom-blue text-2xl tracking-wider pb-3">
//           {title}
//         </p>
//         <p className="text-letter1 text-lg text-lato text-bold">{subTitle}</p>
//       </div>

//       <CardSwipper servicesData={filtered} />

//     </div>
//   );
// }

// app/serviced/page.jsx
// ⚠️ "use client" வேண்டாம்!

import ServicedClient from "./ServiceClient";

export const metadata = {
  title: "Our Legal Services | Briefcasse",
  description:
    "Explore Briefcasse's complete range of legal services — Startup Registration, Trademark, Tax Filing, MCA Compliance, Legal Advisory and more. Expert support for businesses in India.",
  keywords: [
    "legal services India",
    "startup registration",
    "trademark registration",
    "tax filing",
    "MCA compliance",
    "legal advisory",
    "intellectual property",
    "Briefcasse services",
  ],
  alternates: {
    canonical: "/serviced",
  },
  openGraph: {
    type: "website",
    title: "Our Legal Services | Briefcasse",
    description:
      "Startup Registration, Trademark, Tax Filing, MCA Compliance, Legal Advisory and more — all in one place at Briefcasse.",
    url: "https://www.briefcasse.com/serviced",
    siteName: "Briefcasse",
    images: [
      {
        url: "/assets/brief_blue.png",
        width: 1200,
        height: 630,
        alt: "Briefcasse Legal Services",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Legal Services | Briefcasse",
    description:
      "Startup, Trademark, Tax Filing, MCA Compliance and more — expert legal services by Briefcasse.",
    images: ["/assets/brief_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServicedPage() {
  return <ServicedClient />;
}