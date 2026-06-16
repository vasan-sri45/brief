"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
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

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getLatestWorkingUpdate = (order) => {
  const messages = Array.isArray(order?.progressMessages)
    ? order.progressMessages
    : [];
  const latest = messages.at(-1);

  return (
    latest?.message ||
    (order?.serviceStatus
      ? `Your service is currently ${order.serviceStatus}.`
      : "Our team is reviewing your service request and will share updates soon.")
  );
};

const downloadInvoice = (order) => {
  const invoiceDate = formatDate(order.paymentDate || order.createdAt);
  const serviceName = getServiceName(order);
  const invoiceNo = order.serviceNo || order._id || "Not available";
  const amount = formatPrice(order.amount);
  const baseAmount = formatPrice(order.baseAmount || order.amount);
  const gstAmount = formatPrice(order.gstAmount || 0);
  const gstRate = Number(order.gstRate ?? 18);
  const customer = order.customer || {};
  const user = order.userId || {};
  const customerName = user.name || customer.name || "Customer";
  const customerMobile = user.mobile || customer.mobile || "-";
  const customerEmail = user.email || customer.email || "-";
  const serviceTitle = order.serviceId?.title || "Briefcasse Service";
  const paymentId = order.razorpayPaymentId || order.paymentId || "-";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Tax Invoice ${escapeHtml(invoiceNo)}</title>
    <style>
      body { margin: 0; background: #282828; font-family: Arial, sans-serif; color: #000; }
      .page { width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 42px 74px; box-sizing: border-box; }
      .header { display: grid; grid-template-columns: 1fr 270px; align-items: start; gap: 40px; }
      .brand { display: flex; align-items: center; gap: 12px; color: #243894; }
      .logo { width: 122px; height: 96px; background: #2f55ff; border-radius: 6px; position: relative; }
      .logo:before { content: ""; position: absolute; left: 18px; top: 18px; width: 86px; height: 18px; background: #fff; transform: skewX(-28deg); }
      .logo:after { content: ""; position: absolute; left: 22px; bottom: 18px; width: 74px; height: 52px; border-left: 12px solid #fff; border-right: 12px solid #fff; transform: skewX(-35deg); }
      .brand-name { font-size: 26px; font-weight: 800; color: #243894; }
      .tagline { margin-top: 12px; font-size: 16px; font-weight: 700; color: #243894; }
      .invoice-title { font-size: 26px; font-weight: 800; margin: 8px 0 24px; }
      .meta { font-size: 14px; line-height: 2; }
      .rule { height: 3px; background: #313994; margin: 38px 0 34px; }
      .bill-title { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
      .bill p { margin: 0 0 16px; font-size: 17px; }
      .details { margin-top: 48px; display: grid; grid-template-columns: 230px 1fr; row-gap: 30px; font-size: 17px; }
      .details strong { font-weight: 800; }
      .total { margin-top: 34px; padding-top: 24px; border-top: 2px solid #e5e7eb; display: grid; grid-template-columns: 230px 1fr; font-size: 18px; }
      @media print { body { background: #fff; } .page { margin: 0; width: auto; min-height: auto; } }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div class="brand">
          <div class="logo"></div>
          <div>
            <div class="brand-name">Briefcasse</div>
            <div class="tagline">Legal | Compliance | IP Services</div>
          </div>
        </div>
        <div>
          <div class="invoice-title">Tax Invoice</div>
          <div class="meta">
            <div>Invoice No: ${escapeHtml(invoiceNo)}</div>
            <div>Date: ${escapeHtml(invoiceDate)}</div>
          </div>
        </div>
      </div>
      <div class="rule"></div>

      <div class="bill">
        <div class="bill-title">Bill To</div>
        <p>${escapeHtml(customerName)}</p>
        <p>${escapeHtml(customerMobile)}</p>
        <p>${escapeHtml(customerEmail)}</p>
      </div>

      <div class="details">
        <strong>Service Title</strong><span>${escapeHtml(serviceTitle)}</span>
        <strong>Service</strong><span>${escapeHtml(serviceName)}</span>
        <strong>Payment Mode</strong><span>${escapeHtml(order.paymentMode || "Online")}</span>
        <strong>Payment Status</strong><span>${escapeHtml(order.status || "paid")}</span>
        <strong>Payment ID</strong><span>${escapeHtml(paymentId)}</span>
        <strong>Service Price</strong><span>${escapeHtml(baseAmount)}</span>
        <strong>GST (${gstRate}%)</strong><span>${escapeHtml(gstAmount)}</span>
      </div>

      <div class="total">
        <strong>Total</strong><strong>${escapeHtml(amount)}</strong>
      </div>
    </div>
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
  const currentOrders = paidOrders.filter((order) => !isCompleted(order));

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
      <div className="max-w-7xl mx-auto px-4 py-5 md:px-5">
        <div className="relative mb-10 mt-3 overflow-hidden rounded-[28px] bg-[#FFF7C7] border border-[#FFD94E] p-4 md:mb-16 md:mt-5 md:rounded-[42px] md:p-8 xl:p-10">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D4A700_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative z-10 grid grid-cols-1 gap-6 items-stretch xl:grid-cols-2 xl:gap-8">
            <div className="relative flex min-h-[360px] justify-center items-center overflow-hidden sm:min-h-[440px] xl:min-h-[520px]">
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
                className="relative z-10 h-full max-h-[360px] w-auto object-contain transition-transform duration-500 hover:scale-105 sm:max-h-[440px] xl:max-h-[520px]"
                priority
              />
            </div>

            <div className="flex h-full flex-col justify-center rounded-[28px] border border-[#FFE680] bg-white p-5 shadow-xl md:p-7 xl:rounded-[36px] xl:p-9">
              <span className="mb-5 inline-block w-fit rounded-full bg-[#FFD94E] px-4 py-2 text-sm font-bold text-black">
                Briefcasse Buddy
              </span>

              <div
                className={`transition-all duration-300 ${
                  blink ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                <h2 className="text-3xl font-anton text-[#375DD8] mb-4 leading-tight md:text-4xl md:mb-5">
                  Why Choose Briefcasse?
                </h2>

                <p className="text-gray-700 text-base leading-7 md:text-lg md:leading-8">
                  {heroMessages[currentMessage]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 md:gap-4 md:mt-8">
                <div className="bg-[#FFF7C7] rounded-2xl p-4 border border-[#FFD94E] transition-transform duration-300 hover:scale-105 md:p-5">
                  <p className="text-2xl font-bold text-[#D4A700] md:text-3xl">80+</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Business Services
                  </p>
                </div>

                <div className="bg-[#FFF7C7] rounded-2xl p-4 border border-[#FFD94E] transition-transform duration-300 hover:scale-105 md:p-5">
                  <p className="text-2xl font-bold text-[#D4A700] md:text-3xl">24/7</p>
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
          currentOrders={currentOrders}
          hasOrders={paidOrders.length > 0}
        />
      </div>
    </section>
  );
}

function PurchasedServicesSummary({
  loading,
  previousOrders,
  currentOrders,
  hasOrders,
}) {
  const [previousIndex, setPreviousIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedPrevious =
    previousOrders.length > 0
      ? previousOrders[previousIndex % previousOrders.length]
      : null;
  const selectedCurrent =
    currentOrders.length > 0
      ? currentOrders[currentIndex % currentOrders.length]
      : null;

  if (loading) {
    return (
      <div className="mt-20 mb-10 text-center font-lato font-bold text-letter1">
        Loading your services...
      </div>
    );
  }

  if (!hasOrders) return null;

  return (
    <div className="flex flex-col items-stretch gap-6 mt-20 mb-10 md:flex-row">
      {selectedPrevious && (
        <div className="bg-custom-blue rounded-3xl p-6 md:p-7 text-white shadow-lg w-full md:w-[420px] min-h-[456px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-anton tracking-wide">
              Previously Availed Services
            </h2>
            <CarouselControls
              count={previousOrders.length}
              onPrevious={() =>
                setPreviousIndex(
                  (value) =>
                    (value - 1 + previousOrders.length) %
                    previousOrders.length
                )
              }
              onNext={() =>
                setPreviousIndex(
                  (value) => (value + 1) % previousOrders.length
                )
              }
              variant="blue"
            />
          </div>

          <div
            key={selectedPrevious._id || selectedPrevious.serviceNo}
            className="flex min-h-[310px] flex-col justify-between bg-white/10 border border-white/20 rounded-2xl px-5 py-4 transition hover:bg-white/15"
          >
            <Link href="/" className="block">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-lg font-semibold">
                  {getServiceName(selectedPrevious)}
                </p>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {formatDate(
                    selectedPrevious.paymentDate || selectedPrevious.updatedAt
                  )}
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => downloadInvoice(selectedPrevious)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-lato text-xs font-extrabold text-custom-blue transition hover:bg-starttext"
            >
              <Download size={15} />
              Download Invoice
            </button>
          </div>
        </div>
      )}

      {selectedCurrent && (
        <div className="bg-white border-2 border-[#FFD94E] rounded-3xl p-6 md:p-7 text-black shadow-lg w-full md:w-[420px] min-h-[456px]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-2xl font-anton tracking-wide text-[#D4A700]">
              Current
            </h2>
            <CarouselControls
              count={currentOrders.length}
              onPrevious={() =>
                setCurrentIndex(
                  (value) =>
                    (value - 1 + currentOrders.length) % currentOrders.length
                )
              }
              onNext={() =>
                setCurrentIndex((value) => (value + 1) % currentOrders.length)
              }
            />
          </div>

          <div
            key={selectedCurrent._id || selectedCurrent.serviceNo}
            className="flex min-h-[310px] flex-col justify-between bg-[#FFF9E6] border border-[#FFD94E] rounded-2xl px-5 py-4"
          >
            <div className="mb-3">
              <p className="text-lg font-semibold">
                {getServiceName(selectedCurrent)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-black/70">
              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="font-medium text-[#A67C00] text-right">
                  {selectedCurrent.serviceStatus || "Processing"}
                </span>
              </div>

              <div className="rounded-xl bg-white/70 p-3">
                <span className="block text-xs font-bold uppercase tracking-wide text-[#A67C00]">
                  Working Update
                </span>
                <p className="mt-1 font-medium leading-6 text-black/80">
                  {getLatestWorkingUpdate(selectedCurrent)}
                </p>
              </div>

              <div className="flex justify-between gap-4">
                <span>Price</span>
                <span>{formatPrice(selectedCurrent.amount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => downloadInvoice(selectedCurrent)}
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

function CarouselControls({ count, onPrevious, onNext, variant = "yellow" }) {
  if (count <= 1) return null;

  const buttonClass =
    variant === "blue"
      ? "border-white/40 bg-white/10 text-white hover:bg-white hover:text-custom-blue"
      : "border-[#FFD94E] bg-white text-[#D4A700] hover:bg-[#FFF7C7]";

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous service"
        className={`grid h-9 w-9 place-items-center rounded-full border transition ${buttonClass}`}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next service"
        className={`grid h-9 w-9 place-items-center rounded-full border transition ${buttonClass}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
