
"use client";

export default function ServicePage({ service }) {
  return (
    <section className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1E4484]">
        {service.heading}
      </h1>

      <p className="text-gray-700">{service.description}</p>
    </section>
  );
}

