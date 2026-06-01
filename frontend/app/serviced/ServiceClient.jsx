"use client";
import CardSwipper from "../components/services/CardSwipper";
import {
  useAllServices,
  useMyPurchasedServices,
} from "../hooks/userServiceList";
import {
  ChevronDown,
  Download,
  Printer,
} from "lucide-react";
import {
  downloadServiceInvoice,
  printServiceInvoice,
} from "../utils/serviceInvoice";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ServicePage() {
  const user = useSelector((state) => state.auth.user);

  const {
    data: servicesData,
    isLoading,
    error,
  } = useAllServices();
  const { data: purchasedData } = useMyPurchasedServices(!!user);

  const services = servicesData?.items || [];
  const purchases = Array.isArray(purchasedData?.orders)
    ? purchasedData.orders
    : [];

  if (isLoading) {
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
        <PurchasedServices orders={purchases} />

        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease.</p> */}
          <Section title="Startup"
          subTitle="We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease."
          services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively.</p> */}
          <Section title="Intellectual Property"
          subTitle="We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively."
          services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free.</p> */}
          <Section title="Tax Filing"
            subTitle="We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free."
          services={services} />
        </div>
        <div>
          {/* <p>We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly.</p> */}
          <Section title="MCA Compliance"
          subTitle="We assist in filing and managing MCA complaints efficiently to help individuals and businesses resolve corporate compliance issues smoothly."
          services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence.</p> */}
          <Section title="Registration"
          subTitle="We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence."
          services={services} />
        </div>
        <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships.</p> */}
          <Section title="Legal Advisory & Agreement"
          subTitle="We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear, enforceable business relationships."
          services={services} />
        </div>
       <div>
          {/* <p className="text-letter1 text-bold text-lato text-lg">We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs.</p> */}
          <Section title="Other Services"
          subTitle="We offer a wide range of other professional services tailored to meet diverse legal, compliance, and business support needs."
          services={services} />
       </div>
      </div>
    </section>
  );
}


function Section({ title ,subTitle, services }) {

  // ⭐ MAIN FIX
  const filtered = services.filter(
    (s) => s.title?.trim().toLowerCase() === title.trim().toLowerCase()
  );

  return (
    <div className="mb-12">

      <div className="pb-8 text-center">
        <p className="font-anton font-semibold text-custom-blue text-2xl tracking-wider pb-3">
          {title}
        </p>
        <p className="text-letter1 text-lg text-lato text-bold">{subTitle}</p>
      </div>

      <CardSwipper servicesData={filtered} />

    </div>
  );
}

function PurchasedServices({ orders }) {
  const [openId, setOpenId] = useState(null);

  if (!orders.length) return null;

  return (
    <section className="mb-12 rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 shadow-sm md:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-anton text-2xl font-semibold tracking-wide text-custom-blue">
            Purchased Services
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Active and completed services are available here with work updates and invoices.
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
          {orders.length} total
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {orders.map((order) => {
          const isOpen = openId === order._id;
          const isPaid = order.status === "paid";

          return (
            <article
              key={order._id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : order._id)}
                className="flex w-full flex-col gap-3 text-left md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {order.serviceNo || order.razorpayOrderId || "Service"}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {order.serviceId?.heading || order.serviceSlug}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {order.serviceId?.title || "Briefcasse Service"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                    Rs. {Number(order.amount || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                    {order.serviceStatus}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-blue-600 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Info label="Payment" value={order.status} />
                    <Info label="Mode" value={order.paymentMode || "Online"} />
                    <Info
                      label="Date"
                      value={new Date(order.paymentDate || order.createdAt).toLocaleDateString("en-IN")}
                    />
                    <Info
                      label="Assigned"
                      value={order.assignedTo?.name || "Not assigned"}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="font-bold text-slate-900">Work Messages</p>
                    <div className="mt-3 space-y-3">
                      {order.progressMessages?.length ? (
                        order.progressMessages.map((message, index) => (
                          <div
                            key={`${message.createdAt}-${index}`}
                            className="rounded-xl bg-white p-3 text-sm text-slate-600"
                          >
                            <p className="font-bold text-slate-900">
                              {message.createdBy?.name || "Briefcasse Team"}
                            </p>
                            <p className="mt-1 whitespace-pre-line">{message.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-slate-500">
                          No work updates yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {isPaid && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => downloadServiceInvoice(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                      >
                        <Download size={18} />
                        Download Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() => printServiceInvoice(order)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
                      >
                        <Printer size={18} />
                        Print Invoice
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value || "-"}</p>
    </div>
  );
}
