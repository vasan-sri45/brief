"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useServiceBySlug } from "../../../hooks/useServiceBySlug";
import { loadRazorpay } from "../../../utils/loadRazorPay";
  import { api } from "../../../api/api"; // adjust path
  import ContactForm from "../../../components/common/Contact";

export default function ServicePricingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPrice = searchParams.get("price");
  const queryTitle = searchParams.get("title");

  const { service, isLoading, error } = useServiceBySlug(slug);

  const [price, setPrice] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  /* Resolve final price */
  useEffect(() => {
    if (queryPrice) {
      setPrice(queryPrice);
      setTitle(queryTitle || slug);
      return;
    }

    if (!isLoading && service?.price) {
      setPrice(service.price);
      setTitle(service.title || slug);
    }
  }, [queryPrice, queryTitle, service, isLoading, slug]);

const handlePayment = async () => {
  setLoading(true);

  const razorpayLoaded = await loadRazorpay();
  if (!razorpayLoaded) {
    alert("Razorpay SDK failed to load");
    setLoading(false);
    return;
  }

  try {
    /* 1️⃣ Create order */
    const { data: orderData } = await api.post(
      "/payment/create-order",
      { slug }
    );

    /* 2️⃣ Razorpay options */
    const options = {
      key: orderData.key,
      amount: Number(orderData.amount) * 100,
      currency: "INR",
      name: "Briefcase",
      description: title,
      order_id: orderData.orderId,
      handler: async function (response) {
        /* 3️⃣ Verify payment */
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
      theme: { color: "#2563EB" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    alert(err.response?.data?.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};


  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading service...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found
      </div>
    );
  }

  if (!price) {
    return (
      // <div className="min-h-screen flex items-center justify-center">
      //   <button
      //     onClick={() => router.push("/contact")}
      //     className="px-6 py-3 bg-[#2563EB] text-white rounded-lg"
      //   >
      //     Contact Office
      //   </button>
      // </div>
      <ContactForm />
    );
  }

  /* ================= UI ================= */

  return (
    <section className="w-full py-10">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#1E3A8A] uppercase">
            {title} Pricing
          </h1>
          <p className="mt-2 text-slate-600">
            Service: <span className="font-semibold">{slug}</span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-xl border p-6 shadow-sm bg-white">
            <h3 className="text-lg font-bold text-[#1E3A8A]">
              Service Fee
            </h3>

            <p className="text-4xl font-extrabold mt-4">
              ₹{price}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✔ Expert Consultation</li>
              <li>✔ Government Filing</li>
              <li>✔ Documentation</li>
              <li>✔ End-to-End Support</li>
            </ul>

            <button
              disabled={loading}
              onClick={handlePayment}
              className={`mt-6 w-full py-2 rounded-lg font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}

