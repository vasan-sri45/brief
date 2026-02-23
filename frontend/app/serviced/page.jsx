"use client";
import CardSwipper from "../components/services/CardSwipper";
import { useAuthGuard } from "../components/route/useAuthGuard";
import { useAllServices } from "../hooks/userServiceList";

export default function ServicePage() {
  const { loading: authLoading } = useAuthGuard(["user"]);

  const {
    data: servicesData,
    isLoading,
    error,
  } = useAllServices();

  const services = servicesData?.items || [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading services...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Failed to load services</div>;
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease.</p> */}
          <Section title="Startup" services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively.</p> */}
          <Section title="Intellectual Property" services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free.</p> */}
          <Section title="Tax Filling" services={services} />
        </div>
        <div>
          {/* <p>We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly.</p> */}
          <Section title="MCA Compliance" services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence.</p> */}
          <Section title="Registration" services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships.</p> */}
          <Section title="Legal Advisory & Agreement" services={services} />
        </div>
       <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs.</p> */}
          <Section title="Other Services" services={services} />
       </div>
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