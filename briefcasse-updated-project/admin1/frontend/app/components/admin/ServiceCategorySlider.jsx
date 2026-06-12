// components/admin/ServiceCategorySlider.jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import DashboardCard from "./DashboardCard";

export default function ServiceCategorySlider({ title, services }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      }
    );
  }, [services]);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-4">
        {title}
      </h2>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
      >
        {services.map((svc) => (
          <DashboardCard
            key={svc._id}
            title={svc.title}
            value={svc.count || 1}
            services={svc.category}
            link={`/services/${svc.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
