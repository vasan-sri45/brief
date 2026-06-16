"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

import { api } from "../../../api/api";
import ContactForm from "../../../components/common/Contact";
import { useServiceBySlug } from "../../../hooks/useServiceBySlug";
import { loadRazorpay } from "../../../utils/loadRazorPay";

export default function ServicePricingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTitle = searchParams.get("title");
  const { service, isLoading, error } = useServiceBySlug(slug);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (service?.title) {
      setTitle(queryTitle || service.title);
    }
  }, [service, queryTitle]);

  const handlePayment = async (price) => {
    setLoading(true);

    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const { data: orderData } = await api.post("/payment/create-order", {
        slug,
        price,
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Briefcasse",
        description: title,
        order_id: orderData.orderId,
        handler: async function (response) {
          const { data: verifyData } = await api.post(
            "/payment/verify",
            response
          );

          if (verifyData.success) {
            router.push("/");
          } else {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#2563EB",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-lato font-bold text-custom-blue">
        Loading service...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-lato font-bold text-custom-blue">
        Service not found
      </div>
    );
  }

  if (!service?.prices || service.prices.length === 0) {
    return <ContactForm />;
  }

  return (
    <section className="min-h-screen w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFD94E] bg-[#FFF7C7] px-4 py-2 font-lato text-sm font-extrabold text-[#9A7400]">
            <Sparkles size={16} />
            Secure service checkout
          </div>

          <h1 className="font-anton text-3xl font-normal uppercase tracking-wide text-custom-blue md:text-5xl">
            {title} Pricing
          </h1>

          <p className="mt-3 text-base font-lato font-bold text-letter1 md:text-lg">
            {service.heading}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["Secure payment", "Instant confirmation", "Expert support"].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-custom-blue/10 bg-[#F7F9FF] px-4 py-2 font-lato text-sm font-extrabold text-custom-blue"
                >
                  <ShieldCheck size={16} />
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div
          className={`gap-8 ${
            service.prices.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {service.prices.map((plan, index) => {
            const isPayment = plan.type === "payment";

            return (
              <div
                key={index}
                className="group relative w-full max-w-md overflow-hidden rounded-[28px] border-2 border-custom-blue/10 bg-white shadow-[0_18px_45px_rgba(37,99,235,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-custom-blue/40 hover:shadow-[0_26px_60px_rgba(37,99,235,0.18)]"
              >
                <div className="h-2 w-full bg-custom-blue" />

                <div className="p-8">
                  <div className="mb-7 flex items-center justify-between gap-4">
                    <h3 className="font-anton text-2xl font-normal uppercase tracking-wide text-custom-blue">
                      {isPayment ? `PLAN ${index + 1}` : plan.amount}
                    </h3>

                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF7C7] text-custom-blue">
                      <CreditCard size={22} />
                    </span>
                  </div>

                  <div className="rounded-2xl border border-[#FFD94E] bg-[#FFF7C7] px-5 py-6 text-center">
                    {isPayment ? (
                      <span className="font-lato text-5xl font-extrabold text-custom-blue md:text-6xl">
                        ₹{plan.amount}
                      </span>
                    ) : (
                      <span className="font-lato text-3xl font-extrabold text-custom-blue">
                        Contact Us
                      </span>
                    )}
                  </div>

                  <ul className="mt-8 space-y-4 text-letter1">
                    {plan.features?.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 font-lato text-base font-bold"
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-custom-blue text-white">
                          <Check size={15} strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isPayment ? (
                    <button
                      disabled={loading}
                      onClick={() => handlePayment(plan.amount)}
                      className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-lato text-lg font-extrabold transition ${
                        loading
                          ? "cursor-not-allowed bg-gray-400 text-white"
                          : "bg-custom-blue text-white shadow-lg shadow-blue-200 hover:bg-[#244cc4]"
                      }`}
                    >
                      <CreditCard size={20} />
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/user/contact")}
                      className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-starttext py-4 font-lato text-lg font-extrabold text-custom-blue shadow-lg shadow-yellow-100 transition hover:bg-[#f5ca2d]"
                    >
                      Contact Us
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-custom-blue/20 px-6 py-3 font-lato font-extrabold text-custom-blue transition hover:bg-[#F7F9FF]"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>
    </section>
  );
}
