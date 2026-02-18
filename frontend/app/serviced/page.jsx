"use client";
import CardSwipper from "../components/services/CardSwipper";
import { useAuthGuard } from "../components/route/useAuthGuard";
import { useAllServices } from "../hooks/userServiceList";

export default function ServicePage() {
  /**
   * 🔐 Auth protection
   * - Only logged-in users can access
   * - Redirects to /login if not authenticated
   */
  const { loading: authLoading, user } = useAuthGuard(["user"]);

  /**
   * 📦 Fetch services data
   */
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error,
  } = useAllServices();

  /**
   * ⏳ Wait until:
   * - auth is resolved
   * - services are loaded
   */
  if (authLoading || servicesLoading) {
    return null; // or a spinner
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load services.</p>
      </div>
    );
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
      {/* <Navbar user={user} /> */}

      {/* ================= CONTENT ================= */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto p-5">

          {/* ========= START UPS ========= */}
          <Section
            title="Start Ups"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= INTELLECTUAL PROPERTY ========= */}
          <Section
            title="Intellectual Properties"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= TAX FILING ========= */}
          <Section
            title="Tax Filing"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= MCA COMPLAINTS ========= */}
          <Section
            title="MCA Complaints"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= REGISTRATION ========= */}
          <Section
            title="Registration"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= LEGAL ========= */}
          <Section
            title="Legal Advisory & Agreement"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* ========= OTHER ========= */}
          <Section
            title="Other Services"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      {/* <Footer /> */}
    </>
  );
}

/* =================================================
   REUSABLE SECTION COMPONENT
================================================= */
function Section({ title, description }) {
  return (
    <div className="mb-12">
      <div className="pb-8">
        <p className="text-center pb-2 font-anton font-semibold text-custom-blue text-[1.2rem] md:text-[1.4rem] lg:text-[1.8rem] tracking-wider">
          {title}
        </p>
        <p className="text-center font-lato font-bold text-xs md:text-[0.9rem] lg:text-[1rem] tracking-wide">
          {description}
        </p>
      </div>

      <CardSwipper />
    </div>
  );
}
