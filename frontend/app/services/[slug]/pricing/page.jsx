

// "use client";

// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useServiceBySlug } from "../../../hooks/useServiceBySlug";
// import { loadRazorpay } from "../../../utils/loadRazorPay";
// import { api } from "../../../api/api";
// import ContactForm from "../../../components/common/Contact";

// export default function ServicePricingPage() {

//   const { slug } = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const queryPrice = searchParams.get("price");
//   const queryTitle = searchParams.get("title");

//   const { service, isLoading, error } = useServiceBySlug(slug);

//   const [price, setPrice] = useState(null);
//   const [title, setTitle] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= Resolve Price ================= */

//   useEffect(() => {

//     if (queryPrice) {
//       setPrice(queryPrice);
//       setTitle(queryTitle || slug);
//       return;
//     }

//     if (!isLoading && service?.price) {
//       setPrice(service.price);
//       setTitle(service.title || slug);
//     }

//   }, [queryPrice, queryTitle, service, isLoading, slug]);


//   /* ================= Razorpay Payment ================= */

//   const handlePayment = async () => {

//     setLoading(true);

//     const razorpayLoaded = await loadRazorpay();

//     if (!razorpayLoaded) {
//       alert("Razorpay SDK failed to load");
//       setLoading(false);
//       return;
//     }

//     try {

//       /* 1️⃣ Create Order */
//       const { data: orderData } = await api.post(
//         "/payment/create-order",
//         { slug }
//       );

//       /* 2️⃣ Razorpay Options */

//       const options = {
//         key: orderData.key,
//         amount: orderData.amount, // already in paise
//         currency: "INR",
//         name: "Briefcase",
//         description: title,
//         order_id: orderData.orderId,

//         handler: async function (response) {

//           /* 3️⃣ Verify Payment */

//           const { data: verifyData } = await api.post(
//             "/payment/verify",
//             response
//           );

//           if (verifyData.success) {
//             router.push("/serviced");
//           } else {
//             alert("Payment verification failed");
//           }
//         },

//         theme: { color: "#2563EB" },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.on("payment.failed", function () {
//         alert("Payment failed. Please try again.");
//       });

//       rzp.open();

//     } catch (err) {

//       alert(err.response?.data?.message || "Payment failed");

//     } finally {

//       setLoading(false);

//     }

//   };


//   /* ================= STATES ================= */

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading service...
//       </div>
//     );
//   }

//   if (error || !service) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Service not found
//       </div>
//     );
//   }

//   if (!price) {
//     return <ContactForm />;
//   }


//   /* ================= UI ================= */

//   return (

//     <section className="w-full py-10">

//       <div className="max-w-4xl mx-auto px-4">

//         <div className="mb-10 text-center">

//           <h1 className="text-3xl font-bold text-[#1E3A8A] uppercase">
//             {title} Pricing
//           </h1>

//           <p className="mt-2 text-slate-600">
//             Service: <span className="font-semibold">{slug}</span>
//           </p>

//         </div>


//         <div className="flex justify-center">

//           <div className="w-full max-w-md rounded-xl border p-6 shadow-sm bg-white">

//             <h3 className="text-lg font-bold text-[#1E3A8A]">
//               Service Fee
//             </h3>

//             <p className="text-4xl font-extrabold mt-4">
//               ₹{price}
//             </p>


//             <ul className="mt-4 space-y-2 text-sm text-slate-600">
//               <li>✔ Expert Consultation</li>
//               <li>✔ Government Filing</li>
//               <li>✔ Documentation</li>
//               <li>✔ End-to-End Support</li>
//             </ul>


//             <button
//               disabled={loading}
//               onClick={handlePayment}
//               className={`mt-6 w-full py-2 rounded-lg font-semibold transition
//                 ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-[#2563EB] hover:bg-[#1E40AF] text-white"
//                 }`}
//             >

//               {loading ? "Processing..." : "Pay Now"}

//             </button>

//           </div>

//         </div>


//         <div className="mt-10 flex justify-center">

//           <button
//             onClick={() => router.back()}
//             className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
//           >
//             ← Back
//           </button>

//         </div>

//       </div>

//     </section>
//   );
// }




"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useServiceBySlug } from "../../../hooks/useServiceBySlug";

import { loadRazorpay } from "../../../utils/loadRazorPay";

import { api } from "../../../api/api";

import ContactForm from "../../../components/common/Contact";

export default function ServicePricingPage() {

  const { slug } = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const queryTitle = searchParams.get("title");

  const { service, isLoading, error } =
    useServiceBySlug(slug);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");

  /* ================= PAGE TITLE ================= */

  useEffect(() => {

    if (service?.title) {

      setTitle(queryTitle || service.title);

    }

  }, [service, queryTitle]);

  /* ================= PAYMENT ================= */

  const handlePayment = async (price) => {

    setLoading(true);

    const razorpayLoaded =
      await loadRazorpay();

    if (!razorpayLoaded) {

      alert("Razorpay SDK failed to load");

      setLoading(false);

      return;

    }

    try {

      /* CREATE ORDER */

      const { data: orderData } =
        await api.post(
          "/payment/create-order",
          {
            slug,
            price,
          }
        );

      /* RAZORPAY OPTIONS */

      const options = {

        key: orderData.key,

        amount: orderData.amount,

        currency: "INR",

        name: "Briefcase",

        description: title,

        order_id: orderData.orderId,

        handler: async function (response) {

          const { data: verifyData } =
            await api.post(
              "/payment/verify",
              response
            );

          if (verifyData.success) {

            router.push("/serviced");

          } else {

            alert(
              "Payment verification failed"
            );

          }

        },

        theme: {
          color: "#2563EB",
        },

      };

      const rzp =
        new window.Razorpay(options);

      rzp.on(
        "payment.failed",
        function () {

          alert(
            "Payment failed. Please try again."
          );

        }
      );

      rzp.open();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Payment failed"
      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= LOADING ================= */

  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading service...

      </div>

    );

  }

  /* ================= ERROR ================= */

  if (error || !service) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Service not found

      </div>

    );

  }

  /* ================= EMPTY PRICES ================= */

  if (
    !service?.prices ||
    service.prices.length === 0
  ) {

    return <ContactForm />;

  }

  /* ================= UI ================= */

  return (

    <section className="w-full py-10 bg-gray-50 min-h-screen">

      <div className="max-w-6xl mx-auto px-4">

        {/* HEADING */}

        <div className="mb-10 text-center">

          <h1 className="text-3xl font-bold text-[#1E3A8A] uppercase">

            {title} Pricing

          </h1>

          <p className="mt-2 text-slate-600">

            {service.heading}

          </p>

        </div>

        {/* PRICING CARDS */}

        <div
          className={`
            ${
              service.prices.length === 1
                ? "flex justify-center"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }
            gap-8
          `}
        >

          {service.prices.map(
            (plan, index) => {

              const isPayment =
                plan.type === "payment";

              return (

                <div
                  key={index}
                  className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border-2
                    p-8
                    bg-white
                    transition-all
                    duration-300
                    border-gray-200
                    hover:border-blue-400
                    hover:shadow-xl
                  "
                >

                  {/* TITLE */}

                  <h3 className="text-xl font-bold text-center text-gray-700 uppercase">

                    {isPayment
                      ? `PLAN ${index + 1}`
                      : plan.amount}

                  </h3>

                  {/* PRICE / CONTACT */}

                  <div className="mt-6 text-center">

                    {isPayment ? (

                      <span className="text-5xl font-extrabold text-[#1E3A8A]">

                        ₹{plan.amount}

                      </span>

                    ) : (

                      <span className="text-3xl font-bold text-[#1E3A8A]">

                        Contact Us

                      </span>

                    )}

                  </div>

                  {/* FEATURES */}

                  <ul className="mt-8 space-y-3 text-slate-700">

                    {plan.features?.map(
                      (feature, i) => (

                        <li
                          key={i}
                          className="flex items-center"
                        >

                          <span className="mr-2 text-blue-600 font-bold">

                            ✔

                          </span>

                          {feature}

                        </li>

                      )
                    )}

                  </ul>

                  {/* BUTTON */}

                  {isPayment ? (

                    <button
                      disabled={loading}
                      onClick={() =>
                        handlePayment(
                          plan.amount
                        )
                      }
                      className={`mt-8 w-full py-3 rounded-lg font-bold text-lg transition
                        
                        ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                        }`}
                    >

                      {loading
                        ? "Processing..."
                        : "Pay Now"}

                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        router.push(
                          "/user/contact"
                        )
                      }
                      className="mt-8 w-full py-3 rounded-lg font-bold text-lg bg-orange-500 hover:bg-orange-600 text-white transition"
                    >

                      Contact Us

                    </button>

                  )}

                </div>

              );

            }
          )}

        </div>

        {/* BACK BUTTON */}

        <div className="mt-12 flex justify-center">

          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          >

            ← Back

          </button>

        </div>

      </div>

    </section>

  );

}