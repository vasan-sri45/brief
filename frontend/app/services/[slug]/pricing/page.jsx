"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  CreditCard,
  FileText,
  Headphones,
  IndianRupee,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { useServiceBySlug } from "../../../hooks/useServiceBySlug";
import { loadRazorpay } from "../../../utils/loadRazorPay";
import { api } from "../../../api/api";
import ContactForm from "../../../components/common/Contact";

const fallbackFeatures = [
  "Expert Consultation",
  "Government Filing",
  "Documentation",
  "End-to-End Support",
];

const supportItems = [
  {
    icon: <ShieldCheck size={18} />,
    title: "Secure Payment",
    text: "Razorpay protected checkout",
  },
  {
    icon: <FileText size={18} />,
    title: "Invoice Ready",
    text: "Invoice after successful payment",
  },
  {
    icon: <Headphones size={18} />,
    title: "Service Support",
    text: "Briefcasse team updates your work",
  },
];

const GST_RATE = 18;

const getGstBreakdown = (amount = 0) => {
  const baseAmount = Math.round(Number(amount || 0));
  const gstAmount = Math.round((baseAmount * GST_RATE) / 100);
  return {
    baseAmount,
    gstAmount,
    totalAmount: baseAmount + gstAmount,
  };
};

const formatAmount = (amount = 0) =>
  Number(amount || 0).toLocaleString("en-IN");

export default function ServicePricingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTitle = searchParams.get("title");
  const { user, hydrated } = useSelector((state) => state.auth);

  const { service, isLoading, error } = useServiceBySlug(slug);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      const currentPath = `/services/${slug}/pricing`;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [hydrated, user, router, slug]);

  useEffect(() => {
    if (service?.title) {
      setTitle(queryTitle || service.title);
    }
  }, [service, queryTitle]);

  const handlePayment = async (price, index) => {
    setLoadingPlan(index);

    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load");
      setLoadingPlan(null);
      return;
    }

    try {
      const { data: orderData } = await api.post("/payment/create-order", {
        slug: service?.slug || slug,
        price,
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Briefcasse",
        description: service?.heading || title,
        order_id: orderData.orderId,
        handler: async function (response) {
          const { data: verifyData } = await api.post(
            "/payment/verify",
            response
          );

          if (verifyData.success) {
            router.push("/serviced");
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
      setLoadingPlan(null);
    }
  };

  if (!hydrated || !user || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-blue-100 bg-white px-8 py-6 text-center shadow-sm">
          <p className="font-bold text-slate-700">Loading secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-red-100 bg-white px-8 py-6 text-center shadow-sm">
          <p className="font-bold text-red-500">Service not found</p>
        </div>
      </div>
    );
  }

  if (!service?.prices || service.prices.length === 0) {
    return <ContactForm />;
  }

  const paymentPlans = service.prices.filter((plan) => plan.type === "payment");
  const contactPlans = service.prices.filter((plan) => plan.type !== "payment");
  const heroImage = service.images?.[0]?.url;

  return (
    <section className="min-h-screen w-full bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.25fr]">
          <aside className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
                Secure Checkout
              </p>
              <h1 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                {title} Pricing
              </h1>
              <p className="mt-3 text-base font-medium leading-7 text-blue-50">
                {service.heading}
              </p>
            </div>

            {heroImage && (
              <div className="h-52 bg-slate-100">
                <img
                  src={heroImage}
                  alt={service.heading || title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 p-6 md:p-8">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                  Service
                </p>
                <p className="mt-1 text-lg font-black text-slate-950">
                  {service.heading || title}
                </p>
                <p className="mt-2 line-clamp-4 text-sm font-medium leading-6 text-slate-600">
                  {service.description ||
                    "Complete your payment to start this Briefcasse service."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {supportItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      {item.icon}
                    </span>
                    <span>
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="text-sm font-medium text-slate-500">
                        {item.text}
                      </p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="rounded-[32px] border border-blue-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                  Choose Your Plan
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Start your service
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                <Lock size={16} />
                Payment protected
              </div>
            </div>

            <div
              className={`mt-7 grid gap-5 ${
                paymentPlans.length === 1
                  ? "lg:grid-cols-[minmax(0,520px)] lg:justify-center"
                  : "md:grid-cols-2"
              }`}
            >
              {paymentPlans.map((plan, index) => {
                const features = plan.features?.length
                  ? plan.features
                  : fallbackFeatures;
                const isBusy = loadingPlan === index;
                const gst = getGstBreakdown(plan.amount);

                return (
                  <article
                    key={`${plan.amount}-${index}`}
                    className="relative overflow-hidden rounded-[28px] border border-blue-200 bg-white p-6 shadow-[0_18px_48px_rgba(37,99,235,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(37,99,235,0.18)]"
                  >
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-50" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
                            Plan {index + 1}
                          </p>
                          <h3 className="mt-2 text-2xl font-black text-slate-950">
                            Service Fee
                          </h3>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                          <CreditCard size={22} />
                        </span>
                      </div>

                      <div className="mt-8 flex items-end gap-2">
                        <span className="text-5xl font-black leading-none text-blue-800 md:text-6xl">
                          <span className="inline-flex items-center">
                            <IndianRupee className="h-10 w-10 md:h-12 md:w-12" />
                            {formatAmount(gst.totalAmount)}
                          </span>
                        </span>
                      </div>

                      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm font-bold text-slate-700">
                        <div className="flex justify-between gap-4">
                          <span>Service price</span>
                          <span>Rs. {formatAmount(gst.baseAmount)}</span>
                        </div>
                        <div className="mt-2 flex justify-between gap-4 text-slate-500">
                          <span>GST ({GST_RATE}%)</span>
                          <span>Rs. {formatAmount(gst.gstAmount)}</span>
                        </div>
                        <div className="mt-3 flex justify-between gap-4 border-t border-blue-100 pt-3 text-blue-800">
                          <span>Total payable</span>
                          <span>Rs. {formatAmount(gst.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                        <Clock3 size={14} />
                        Work begins after payment confirmation
                      </div>

                      <ul className="mt-7 space-y-3">
                        {features.map((feature, i) => (
                          <li
                            key={`${feature}-${i}`}
                            className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                          >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check size={15} />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        disabled={loadingPlan !== null}
                        onClick={() => handlePayment(plan.amount, index)}
                        className={`mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 transition ${
                          loadingPlan !== null
                            ? "cursor-not-allowed bg-slate-400"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-xl"
                        }`}
                      >
                        {isBusy ? "Processing..." : "Pay Securely"}
                        {!isBusy && <ArrowRight size={21} />}
                      </button>

                      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-400">
                        <BadgeCheck size={15} />
                        Invoice generated after successful payment
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {contactPlans.length > 0 && (
              <div className="mt-6 rounded-[24px] border border-amber-100 bg-amber-50 p-5">
                <h3 className="text-lg font-black text-slate-950">
                  Need a custom plan?
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  Some service options require consultation before pricing.
                </p>
                <button
                  onClick={() => router.push("/user/contact")}
                  className="mt-4 rounded-2xl bg-amber-500 px-5 py-3 font-black text-white transition hover:bg-amber-600"
                >
                  Contact Briefcasse
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
