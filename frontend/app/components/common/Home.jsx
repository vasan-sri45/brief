"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReviewCarousel from "./ReviewCarousel";
import { useAuthGuard } from "../../components/route/useAuthGuard";
import { api } from "../../api/api";

const heroMessages = [
  "Briefcasse offers simple, fast, and reliable business registration and compliance services across India. We help startups and businesses with company registration, GST, trademark, legal, and tax support at affordable pricing. Our team provides professional guidance and hassle-free service for all your business needs. Choose Briefcasse for trusted, smooth, and easy business solutions.",
  "Briefcasse offers simple and reliable business registration services for startups and entrepreneurs in India. We help with company formation, legal documentation, and compliance support at affordable pricing. Our team ensures a smooth and quick registration process for your business needs. Trust Briefcasse for professional and hassle-free business solutions.",
];

const formatDate = (value) => {
  if (!value) return "Not updated";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getServiceName = (order) =>
  order?.serviceId?.heading ||
  order?.serviceId?.title ||
  order?.serviceSlug ||
  "Briefcasse Service";

const isCompleted = (order) =>
  String(order?.serviceStatus || "").toLowerCase() === "completed";

const isPaid = (order) => String(order?.status || "").toLowerCase() === "paid";

const getInvoiceFileName = (order) => {
  const serviceNo = order?.serviceNo || order?._id || "invoice";
  return `briefcasse-${String(serviceNo).replace(/[^a-z0-9-]/gi, "-")}.html`;
};

const downloadInvoice = (order) => {
  const invoiceDate = formatDate(order.paymentDate || order.createdAt);
  const serviceName = getServiceName(order);
  const invoiceNo = order.serviceNo || order._id || "Not available";
  const amount = formatPrice(order.amount);
  const baseAmount = formatPrice(order.baseAmount || order.amount);
  const gstAmount = formatPrice(order.gstAmount || 0);
  const gstRate = Number(order.gstRate ?? 18);

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Briefcasse Invoice ${invoiceNo}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; margin: 40px; }
      .header { display: flex; justify-content: space-between; border-bottom: 3px solid #375dd8; padding-bottom: 18px; }
      .brand { color: #375dd8; font-size: 30px; font-weight: 800; letter-spacing: 1px; }
      .label { color: #6b7280; font-size: 13px; text-transform: uppercase; }
      h1 { color: #375dd8; margin: 34px 0 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 26px; }
      th, td { border: 1px solid #dbe4ff; padding: 14px; text-align: left; }
      th { background: #eef3ff; color: #1f3fae; }
      .total { font-size: 22px; font-weight: 800; color: #111827; }
      .footer { margin-top: 34px; color: #6b7280; font-size: 13px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">BRIEFCASSE</div>
        <div class="label">Legal, tax and compliance services</div>
      </div>
      <div>
        <div class="label">Invoice No</div>
        <strong>${invoiceNo}</strong>
        <div class="label" style="margin-top:10px">Date</div>
        <strong>${invoiceDate}</strong>
      </div>
    </div>

    <h1>Service Invoice</h1>
    <p><strong>Service:</strong> ${serviceName}</p>
    <p><strong>Status:</strong> ${order.serviceStatus || "Processing"}</p>
    <p><strong>Payment:</strong> ${order.status || "Paid"} (${order.paymentMode || "Online"})</p>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Base Amount</th>
          <th>GST</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${serviceName}</td>
          <td>${baseAmount}</td>
          <td>${gstAmount} (${gstRate}%)</td>
          <td class="total">${amount}</td>
        </tr>
      </tbody>
    </table>

    <p class="footer">This invoice was generated from your Briefcasse user dashboard.</p>
  </body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getInvoiceFileName(order);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function ServicePage() {
  const {
    loading: authLoading,
    isAuthenticated,
  } = useAuthGuard(["user"]);

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["my-service-orders"],
    queryFn: async () => {
      const res = await api.get("/payment/my-orders", {
        params: { limit: 10 },
      });
      return res.data;
    },
    enabled: !authLoading && isAuthenticated,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });

  const [currentMessage, setCurrentMessage] = useState(0);
  const [blink, setBlink] = useState(false);
  const paidOrders = (ordersData?.orders || []).filter(isPaid);
  const previousOrders = paidOrders.filter(isCompleted).slice(0, 3);
  const currentOrder = paidOrders.find((order) => !isCompleted(order));

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);

      const timeout = setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % heroMessages.length);
        setBlink(false);
      }, 300);

      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto p-5">
        <div className="relative mb-16 mt-5 overflow-hidden rounded-[42px] bg-[#FFF7C7] border border-[#FFD94E] p-5 md:p-10">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D4A700_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="relative flex min-h-[520px] justify-center items-center overflow-hidden">
              <div className="absolute top-4 left-2 md:left-6 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20 animate-bounce">
                GST Registration
              </div>
              <div className="absolute top-24 right-0 md:right-6 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
                Company Setup
              </div>
              <div className="absolute bottom-24 left-0 md:left-8 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
                Legal Support
              </div>
              <div className="absolute bottom-6 right-4 bg-white shadow-lg border border-[#FFD94E] rounded-full px-4 py-2 text-sm font-semibold text-[#9A7400] z-20">
                Compliance
              </div>

              <div className="absolute w-[320px] h-[320px] md:w-[430px] md:h-[430px] rounded-full bg-gradient-to-br from-[#FFD94E] via-[#FFE680] to-[#FFF7C7] animate-pulse opacity-80 blur-sm" />
              <div className="absolute w-[340px] h-[340px] md:w-[470px] md:h-[470px] rounded-full border-[3px] border-dashed border-[#D4A700] animate-[spin_18s_linear_infinite] opacity-40" />
              <div className="absolute top-12 left-10 w-6 h-6 bg-[#FFD94E] rounded-full animate-bounce" />
              <div className="absolute bottom-16 right-12 w-4 h-4 bg-[#D4A700] rounded-full animate-ping" />
              <div className="absolute top-28 right-8 w-5 h-5 bg-yellow-300 rounded-full animate-bounce" />
              <div className="absolute w-[290px] h-[290px] md:w-[400px] md:h-[400px] bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-2xl" />

              <Image
                src="/assets/Dog_Home.webp"
                alt="Briefcasse service assistant"
                width={480}
                height={480}
                unoptimized
                className="relative z-10 h-full max-h-[520px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            <div className="flex h-full flex-col justify-center rounded-[36px] border border-[#FFE680] bg-white p-6 shadow-xl md:p-9">
              <span className="mb-5 inline-block w-fit rounded-full bg-[#FFD94E] px-4 py-2 text-sm font-bold text-black">
                Briefcasse Buddy
              </span>

              <div
                className={`transition-all duration-300 ${
                  blink ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                <h2 className="text-4xl md:text-4xl font-anton text-[#375DD8] mb-5 leading-tight">
                  Why Choose Briefcasse?
                </h2>

                <p className="text-gray-700 text-base md:text-lg leading-8">
                  {heroMessages[currentMessage]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-[#FFF7C7] rounded-2xl p-5 border border-[#FFD94E] hover:scale-105 transition-transform duration-300">
                  <p className="text-3xl font-bold text-[#D4A700]">80+</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Business Services
                  </p>
                </div>

                <div className="bg-[#FFF7C7] rounded-2xl p-5 border border-[#FFD94E] hover:scale-105 transition-transform duration-300">
                  <p className="text-3xl font-bold text-[#D4A700]">24/7</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer Support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewCarousel />

        <PurchasedServicesSummary
          loading={ordersLoading}
          previousOrders={previousOrders}
          currentOrder={currentOrder}
          hasOrders={paidOrders.length > 0}
        />
      </div>
    </section>
  );
}

function PurchasedServicesSummary({
  loading,
  previousOrders,
  currentOrder,
  hasOrders,
}) {
  if (loading) {
    return (
      <div className="mt-20 mb-10 text-center font-lato font-bold text-letter1">
        Loading your services...
      </div>
    );
  }

  if (!hasOrders) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-20 mb-10">
      {previousOrders.length > 0 && (
        <div className="bg-custom-blue rounded-3xl p-6 md:p-7 text-white shadow-lg w-full md:w-[420px]">
          <h2 className="text-2xl font-anton tracking-wide mb-5">
            Previously Availed Services
          </h2>

          <div className="space-y-4">
            {previousOrders.map((order) => (
              <div
                key={order._id || order.serviceNo}
                className="bg-white/10 border border-white/20 rounded-2xl px-5 py-4 transition hover:bg-white/15"
              >
                <Link href="/serviced" className="block">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-lg font-semibold">
                      {getServiceName(order)}
                    </p>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {formatDate(order.paymentDate || order.updatedAt)}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => downloadInvoice(order)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-lato text-xs font-extrabold text-custom-blue transition hover:bg-starttext"
                >
                  <Download size={15} />
                  Download Invoice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentOrder && (
        <div className="bg-white border-2 border-[#FFD94E] rounded-3xl p-6 md:p-7 text-black shadow-lg w-full md:w-[420px]">
          <h2 className="text-2xl font-anton tracking-wide mb-5 text-[#D4A700]">
            Current
          </h2>

          <div className="bg-[#FFF9E6] border border-[#FFD94E] rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="text-lg font-semibold">
                {getServiceName(currentOrder)}
              </p>
              <span className="bg-[#FFD94E]/30 text-[#A67C00] text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2 text-sm text-black/70">
              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="font-medium text-[#A67C00] text-right">
                  {currentOrder.serviceStatus || "Processing"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Last Conversation</span>
                <span>{formatDate(currentOrder.updatedAt)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Price</span>
                <span>{formatPrice(currentOrder.amount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadInvoice(currentOrder)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-custom-blue px-4 py-2 font-lato text-xs font-extrabold text-white transition hover:bg-[#2847b5]"
            >
              <Download size={15} />
              Download Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
