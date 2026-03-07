"use client";

import CardSwipper from "..//services/CardSwipper";
import { useAuthGuard } from "../route/useAuthGuard";
import { useAllServices } from "../../hooks/userServiceList";

export default function ServicePage() {

  const {
    data: servicesData,
    isLoading,
    error,
  } = useAllServices();

  const services = servicesData?.items || [];


  if (error) {
    return <div className="text-center py-20 text-red-500">Failed to load services</div>;
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto p-5">

        <Section title="Startup" services={services} />
        <Section title="Intellectual Property" services={services} />
        <Section title="Tax Filling" services={services} />
        <Section title="MCA Compliance" services={services} />
        <Section title="Registration" services={services} />
        <Section title="Legal Advisory & Agreement" services={services} />
        <Section title="Other Services" services={services} />

      </div>
    </section>
  );
}


function Section({ title, services }) {

  // ⭐ MAIN FIX
  const filtered = services.filter(
    (s) => s.title?.trim().toLowerCase() === title.trim().toLowerCase()
  );

  return (
    <div className="mb-12">

      <div className="pb-8 text-center">
        <p className="font-anton font-semibold text-custom-blue text-2xl tracking-wider">
          {title}
        </p>
      </div>

      <CardSwipper servicesData={filtered} />

    </div>
  );
}