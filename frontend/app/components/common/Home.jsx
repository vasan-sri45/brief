"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCheck2,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReviewCarousel from "./ReviewCarousel";
import { useAuthGuard } from "../../components/route/useAuthGuard";
import { api } from "../../api/api";

const heroMessages = [
  "Briefcasse offers simple, fast, and reliable business registration and compliance services across India. We help startups and businesses with company registration, GST, trademark, legal, and tax support at affordable pricing. Our team provides professional guidance and hassle-free service for all your business needs. Choose Briefcasse for trusted, smooth, and easy business solutions.",
  "Briefcasse offers simple and reliable business registration services for startups and entrepreneurs in India. We help with company formation, legal documentation, and compliance support at affordable pricing. Our team ensures a smooth and quick registration process for your business needs. Trust Briefcasse for professional and hassle-free business solutions.",
];

const stats = [
  { value: "80+", label: "a" },
  { value: "5000+", label: "Clients Supported" },
  { value: "100+", label: "Experts" },
  { value: "24/7", label: "Support" },
];

const supportCards = [
  {
    title: "Lawyers",
    text: "For contracts, notices, and litigation support.",
    href: "/services/talk-to-lawyer",
    stat: "205+ Lawyers",
    Icon: Scale,
  },
  {
    title: "Chartered Accountants (CAs)",
    text: "For tax filings, audits, and financial planning.",
    href: "/services/talk-to-charted-accountant",
    stat: "256+ CAs",
    Icon: Calculator,
  },
  {
    title: "Company Secretaries (CSs)",
    text: "For regulatory compliance and corporate governance.",
    href: "/services/talk-to-company-secretary",
    stat: "200+ CS",
    Icon: FileCheck2,
  },
];

const homeServiceSections = [
  {
    title: "Start and Register Your Business",
    description: "Company, LLP, OPC, trust, and startup registration services.",
    services: [
      {
        heading: "Private Limited Company Registration",
        slug: "private-limited-company-registration",
      },
      {
        heading: "Limited Liability Partnership Registration",
        slug: "limited-liability-partnership-registration",
      },
      {
        heading: "One Person Company Registration",
        slug: "one-person-company-registration",
      },
      {
        heading: "Partnership Firm Registration",
        slug: "partnership-firm-registration",
      },
      {
        heading: "Sole Proprietorship Firm Registration",
        slug: "sole-proprietorship-firm-registration",
      },
      {
        heading: "Section 8 Company Registration",
        slug: "section-8-company-registration",
      },
      {
        heading: "Association Registration",
        slug: "association-registration",
      },
      {
        heading: "Trust Registration",
        slug: "trust-registration",
      },
    ],
  },
  {
    title: "Simplify Your Legal and Compliance Needs",
    description: "Trademark, copyright, patent search, design, and GI support.",
    services: [
      { heading: "Trademark Registration", slug: "trademark-registration" },
      { heading: "Copyright Registration", slug: "copyright-registration" },
      { heading: "Design", slug: "design" },
      {
        heading: "Geographical Indication (GI)",
        slug: "geographical-indication-gi",
      },
      { heading: "Patent Search", slug: "patent-search" },
    ],
  },
  {
    title: "Protect Your IP & Legal Rights",
    description: "GST, DSC, IEC, PAN, TAN, FSSAI, MSME, and annual filings.",
    services: [
      { heading: "DSC Registration", slug: "dsc-registration" },
      {
        heading: "Import Export Code Registration",
        slug: "import-export-code-registration",
      },
      {
        heading: "Startup India Registration",
        slug: "startup-india-registration",
      },
      {
        heading: "Shop & Establishment Registration",
        slug: "shop-establishment-registration",
      },
      {
        heading: "Professional Tax Registration",
        slug: "professional-tax-registration",
      },
      { heading: "PAN Application", slug: "pan-application" },
      { heading: "TAN Application", slug: "tan-application" },
      { heading: "FSSAI Registration", slug: "fssai-registration" },
      { heading: "ESI Registration", slug: "esi-registration" },
      { heading: "GST Registration", slug: "gst-registration" },
      { heading: "LUT under GST", slug: "lut-under-gst" },
      { heading: "Udyam - MSME Registration", slug: "udyam-msme-registration" },
      {
        heading: "Annual Filing for Limited Liability Partnership",
        slug: "annual-filing-limited-liability-partnership",
      },
      {
        heading: "Annual Compliance for Private Limited Company",
        slug: "annual-compliance-private-limited-company",
      },
      { heading: "GST Return Filling", slug: "gst-return-filling" },
    ],
  },
];

const homeFaqs = [
  {
    question: "How do I start a service with Briefcasse?",
    answer:
      "Choose the service you need, open the service page, and complete the payment or enquiry flow. Our team will contact you, collect required documents, and keep you updated through the service process.",
  },
  {
    question: "Can I track my purchased services?",
    answer:
      "Yes. After login, your dashboard shows current and previously availed services with working updates, status, and invoice download options.",
  },
  {
    question: "Do I need to upload documents immediately?",
    answer:
      "No. You can start the service first. Our support team will explain the document requirements and guide you through each step.",
  },
  {
    question: "Is GST added to the service price?",
    answer:
      "Yes. The payment page shows the base price, GST amount, and total payable amount clearly before payment.",
  },
  {
    question: "How will I know the stage of my service?",
    answer:
      "Your service status and working updates are shown in the user dashboard.",
  },
];

const formatDate = (value) => {
  if (!value) return "Not updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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
body { margin:0; background:#282828; font-family:Arial,sans-serif; color:#000; }
.page { width:794px; min-height:1123px; margin:0 auto; background:#fff; padding:42px 74px; box-sizing:border-box; }
.header { display:grid; grid-template-columns:1fr 270px; gap:40px; }
.brand { display:flex; align-items:center; gap:12px; color:#243894; }
.logo { width:122px; height:96px; background:#2f55ff; border-radius:6px; }
.brand-name { font-size:26px; font-weight:800; color:#243894; }
.tagline { margin-top:12px; font-size:16px; font-weight:700; color:#243894; }
.invoice-title { font-size:26px; font-weight:800; margin:8px 0 24px; }
.meta { font-size:14px; line-height:2; }
.rule { height:3px; background:#313994; margin:38px 0 34px; }
.bill-title { font-size:18px; font-weight:800; margin-bottom:20px; }
.bill p { margin:0 0 16px; font-size:17px; }
.details { margin-top:48px; display:grid; grid-template-columns:230px 1fr; row-gap:30px; font-size:17px; }
.total { margin-top:34px; padding-top:24px; border-top:2px solid #e5e7eb; display:grid; grid-template-columns:230px 1fr; font-size:18px; }
@media print { body { background:#fff; } .page { margin:0; width:auto; min-height:auto; } }
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
    <strong>Payment Status</strong><span>${escapeHtml(order.status || "Paid")}</span>
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
  const { loading: authLoading, isAuthenticated } = useAuthGuard(["user"]);
  const [currentMessage, setCurrentMessage] = useState(0);

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

  const paidOrders = (ordersData?.orders || []).filter(isPaid);
  const previousOrders = paidOrders.filter(isCompleted).slice(0, 3);
  const currentOrders = paidOrders.filter((order) => !isCompleted(order));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % heroMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-lato font-bold text-[#375DD8]">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-5">
        <HeroSection currentMessage={currentMessage} />
        <StatsSection />
        <HomeServicesMenu />
        <WhyBriefcasse />
        <ProfessionalSupportSection />
        <ReviewCarousel />

        <PurchasedServicesSummary
          loading={ordersLoading}
          previousOrders={previousOrders}
          currentOrders={currentOrders}
          hasOrders={paidOrders.length > 0}
        />

        <HomeFaqSection />
      </div>
    </section>
  );
}

function HeroSection({ currentMessage }) {
  return (
    <section className="relative mb-10 mt-3 overflow-hidden rounded-[28px] border border-[#FFD94E] bg-[#FFF7C7] p-4 md:mb-16 md:mt-5 md:rounded-[42px] md:p-8 xl:p-10">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D4A700_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:gap-8">
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden sm:min-h-[440px] xl:min-h-[520px]">
          <div className="absolute left-2 top-4 z-20 rounded-full border border-[#FFD94E] bg-white px-4 py-2 text-sm font-semibold text-[#9A7400] shadow-lg md:left-6">
            Pvt Registration
          </div>

          <div className="absolute right-0 top-24 z-20 rounded-full border border-[#FFD94E] bg-white px-4 py-2 text-sm font-semibold text-[#9A7400] shadow-lg md:right-6">
            Trademark
          </div>

          <div className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#FFD94E] bg-white px-4 py-2 text-sm font-semibold text-[#9A7400] shadow-lg md:right-10">
            GST Registration
          </div>

          <div className="absolute bottom-24 left-0 z-20 rounded-full border border-[#FFD94E] bg-white px-4 py-2 text-sm font-semibold text-[#9A7400] shadow-lg md:left-8">
            Agreements
          </div>

          <div className="absolute bottom-6 right-4 z-20 rounded-full border border-[#FFD94E] bg-white px-4 py-2 text-sm font-semibold text-[#9A7400] shadow-lg">
            Talk to Lawyer
          </div>

          <div className="absolute h-[320px] w-[320px] rounded-full bg-gradient-to-br from-[#FFD94E] via-[#FFE680] to-[#FFF7C7] opacity-80 blur-sm md:h-[430px] md:w-[430px]" />
          <div className="absolute h-[340px] w-[340px] rounded-full border-[3px] border-dashed border-[#D4A700] opacity-40 md:h-[470px] md:w-[470px]" />
          <div className="absolute h-[290px] w-[290px] rounded-full border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl md:h-[400px] md:w-[400px]" />

          <Image
            src="/assets/Dog_Home.webp"
            alt="Briefcasse service assistant"
            width={520}
            height={520}
            unoptimized
            priority
            className="relative z-10 h-full max-h-[360px] w-auto object-contain transition-transform duration-500 hover:scale-105 sm:max-h-[440px] xl:max-h-[520px]"
          />
        </div>

        <div className="flex h-full flex-col justify-center rounded-[28px] border border-[#FFE680] bg-white p-5 shadow-xl md:p-7 xl:rounded-[36px] xl:p-9">
          <span className="mb-5 inline-block w-fit rounded-full bg-[#FFD94E] px-4 py-2 text-sm font-bold text-black">
            Briefcasse Buddy
          </span>

          <div className="transition-all duration-300">
            <h2 className="mb-4 font-anton text-3xl leading-tight text-[#375DD8] md:mb-5 md:text-4xl">
              Why Choose Briefcasse?
            </h2>

            <p className="text-base leading-7 text-gray-700 md:text-lg md:leading-8">
              {heroMessages[currentMessage]}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-4">
            <div className="rounded-2xl border border-[#FFD94E] bg-[#FFF7C7] p-4 transition-transform duration-300 hover:scale-105 md:p-5">
              <p className="text-2xl font-bold text-[#D4A700] md:text-3xl">
                80+
              </p>
              <p className="mt-1 text-sm text-gray-600">Business Services</p>
            </div>

            <div className="rounded-2xl border border-[#FFD94E] bg-[#FFF7C7] p-4 transition-transform duration-300 hover:scale-105 md:p-5">
              <p className="text-2xl font-bold text-[#D4A700] md:text-3xl">
                24/7
              </p>
              <p className="mt-1 text-sm text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4 md:py-8">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-3xl border border-[#FFD94E] bg-[#FFF7C7] p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <p className="font-lato text-3xl font-black text-[#D4A700]">
            {item.value}
          </p>
          <p className="mt-1 text-sm font-bold text-gray-600">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

function HomeServicesMenu() {
  return (
    <section className="my-10 overflow-hidden rounded-[36px] border border-[#FFD94E] bg-white px-5 py-8 shadow-sm md:px-10 md:py-12">
  <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      <span className="inline-flex rounded-full border border-[#FFD94E] bg-[#FFF7C7] px-4 py-2 text-sm font-black text-[#D4A700]">
        Our Services
      </span>

      <h2 className="mt-4 font-lato text-3xl font-black text-letter1 md:text-4xl">
        Explore Services
      </h2>

      <p className="mt-3 text-base font-semibold leading-7 text-gray-600">
        Pick a service category and move to the next step easily.
      </p>
    </div>

    <Link
      href="/"
      className="inline-flex w-fit items-center gap-2 rounded-full bg-custom-blue px-5 py-3 text-sm font-black text-white transition hover:bg-[#2847b5]"
    >
      View All Services <ArrowRight size={17} />
    </Link>
  </div>

  <div className="space-y-6">
    {homeServiceSections.map((section, index) => (
      <article
        key={section.title}
        className="group overflow-hidden rounded-[30px] border border-[#FFD94E] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="flex flex-col lg:flex-row">
          <div className="relative overflow-hidden border-b border-[#FFE680] bg-[#FFF7C7] p-6 lg:w-[330px] lg:border-b-0 lg:border-r">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FFD94E]/40 transition duration-300 group-hover:scale-125" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#FFD94E] bg-white text-[#D4A700] shadow-sm">
                  <Building2 size={26} />
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D4A700]">
                  Category {index + 1}
                </span>
              </div>

              <h3 className="font-lato text-2xl font-black leading-snug text-letter1">
                {section.title}
              </h3>

              <p className="mt-3 text-sm font-semibold leading-7 text-gray-600">
                {section.description}
              </p>

              <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#D4A700]">
                {section.services.length} Services
              </div>
            </div>
          </div>

          <div className="flex-1 p-5 md:p-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {section.services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group/item flex items-center justify-between gap-3 rounded-2xl border border-[#FFE680] bg-[#FFF9E6] px-4 py-4 text-sm font-bold text-letter1 transition-all duration-300 hover:border-[#FFD94E] hover:bg-white hover:text-custom-blue hover:shadow-md"
                >
                  <span className="line-clamp-2">{service.heading}</span>

                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#D4A700] transition group-hover/item:bg-[#FFD94E] group-hover/item:text-black">
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#FFE680] pt-5">
              <p className="text-sm font-black text-[#D4A700]">
                Choose service and continue
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-full bg-[#FFF7C7] px-4 py-2 text-sm font-black text-custom-blue transition hover:bg-[#FFD94E]"
              >
                Next <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    ))}
  </div>
</section>
  );
}

function WhyBriefcasse() {
  const items = [
    {
      title: "Fast Processing",
      text: "Clear process and quick service updates.",
      Icon: Zap,
    },
    {
      title: "Expert Guidance",
      text: "Legal, tax, and compliance professionals.",
      Icon: Users,
    },
    {
      title: "Secure Support",
      text: "Your documents and service details stay protected.",
      Icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-10">
      <div className="rounded-[32px] bg-custom-blue p-6 text-white shadow-lg md:p-10">
        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white">
          Why Briefcasse
        </span>

        <h2 className="mt-4 font-lato text-3xl font-black md:text-4xl">
          Simple, Reliable & Professional
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map(({ title, text, Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 transition hover:bg-white/15"
            >
              <Icon size={32} className="text-[#FFD94E]" />

              <h3 className="mt-5 font-lato text-xl font-black">{title}</h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-white/75">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfessionalSupportSection() {
  return (
    <section className="py-10 md:py-12">
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <h2 className="font-lato text-3xl font-black tracking-tight text-letter1 md:text-4xl">
          Professional Support on Demand
        </h2>

        <p className="mt-3 font-lato text-sm font-semibold text-gray-500 md:text-base">
          We guide you through legal, financial, and compliance challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {supportCards.map(({ title, text, href, stat, Icon }) => (
          <article
            key={title}
            className="rounded-[28px] border border-[#FFD94E] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#FFD94E] bg-[#FFF7C7] text-[#D4A700]">
              <Icon size={28} />
            </div>

            <h3 className="mt-5 font-lato text-xl font-black text-letter1">
              {title}
            </h3>

            <p className="mt-2 min-h-[48px] font-lato text-sm font-semibold leading-6 text-gray-500">
              {text}
            </p>

            <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#FFD94E] bg-[#FFF7C7] px-3 py-1 font-lato text-xs font-black text-[#D4A700]">
              <BadgeCheck size={14} className="text-green-500" />
              {stat}
            </span>

            <Link
              href={href}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#07365f] px-5 py-3 font-lato text-sm font-extrabold text-white transition hover:bg-custom-blue"
            >
              Consult Now <ArrowRight size={17} />
            </Link>
          </article>
        ))}
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
      <div className="mb-10 mt-20 text-center font-lato font-bold text-letter1">
        Loading your services...
      </div>
    );
  }

  if (!hasOrders) return null;

  return (
    <section className="py-10">
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-[#FFD94E] px-4 py-2 text-sm font-black text-black">
          Dashboard
        </span>

        <h2 className="mt-4 font-lato text-3xl font-black text-letter1">
          Your Services
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {selectedPrevious && (
          <ServiceStatusCard
            title="Previously Availed Services"
            order={selectedPrevious}
            dark
            count={previousOrders.length}
            onPrevious={() =>
              setPreviousIndex(
                (value) =>
                  (value - 1 + previousOrders.length) % previousOrders.length
              )
            }
            onNext={() =>
              setPreviousIndex((value) => (value + 1) % previousOrders.length)
            }
          />
        )}

        {selectedCurrent && (
          <ServiceStatusCard
            title="Current Service"
            order={selectedCurrent}
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
        )}
      </div>
    </section>
  );
}

function ServiceStatusCard({ title, order, dark, count, onPrevious, onNext }) {
  return (
    <div
      className={`rounded-[28px] p-6 shadow-lg ${
        dark
          ? "bg-custom-blue text-white"
          : "border-2 border-[#FFD94E] bg-white text-black"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3
          className={`font-lato text-2xl font-black ${
            dark ? "text-white" : "text-[#D4A700]"
          }`}
        >
          {title}
        </h3>

        <CarouselControls
          count={count}
          onPrevious={onPrevious}
          onNext={onNext}
          dark={dark}
        />
      </div>

      <div
        className={`rounded-3xl p-5 ${
          dark
            ? "border border-white/20 bg-white/10"
            : "border border-[#FFD94E] bg-[#FFF9E6]"
        }`}
      >
        <p className="text-lg font-black">{getServiceName(order)}</p>

        <div className="mt-5 space-y-3 text-sm font-semibold">
          <div className="flex justify-between gap-4">
            <span className={dark ? "text-white/70" : "text-black/60"}>
              Status
            </span>
            <span className={dark ? "text-white" : "text-[#A67C00]"}>
              {order.serviceStatus || "Processing"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className={dark ? "text-white/70" : "text-black/60"}>
              Date
            </span>
            <span>{formatDate(order.paymentDate || order.updatedAt)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className={dark ? "text-white/70" : "text-black/60"}>
              Price
            </span>
            <span>{formatPrice(order.amount)}</span>
          </div>
        </div>

        {!dark && (
          <div className="mt-5 rounded-2xl bg-white/70 p-4 text-sm font-semibold leading-6 text-black/80">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-[#A67C00]">
              Working Update
            </span>
            {getLatestWorkingUpdate(order)}
          </div>
        )}

        <button
          type="button"
          onClick={() => downloadInvoice(order)}
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-lato text-xs font-black transition ${
            dark
              ? "bg-white text-custom-blue hover:bg-starttext"
              : "bg-custom-blue text-white hover:bg-[#2847b5]"
          }`}
        >
          <Download size={15} />
          Download Invoice
        </button>
      </div>
    </div>
  );
}

function CarouselControls({ count, onPrevious, onNext, dark = false }) {
  if (count <= 1) return null;

  const cls = dark
    ? "border-white/40 bg-white/10 text-white hover:bg-white hover:text-custom-blue"
    : "border-[#FFD94E] bg-white text-[#D4A700] hover:bg-[#FFF7C7]";

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={onPrevious}
        className={`grid h-9 w-9 place-items-center rounded-full border transition ${cls}`}
        aria-label="Previous service"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={onNext}
        className={`grid h-9 w-9 place-items-center rounded-full border transition ${cls}`}
        aria-label="Next service"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mb-12 mt-10 rounded-[32px] border border-[#FFD94E] bg-[#FFF7C7] px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-lato text-3xl font-black text-letter1 md:text-4xl">
          Frequently Asked Questions
        </h2>

        <p className="mt-3 font-lato text-base font-semibold leading-7 text-gray-600">
          Quick answers about starting, tracking, and completing your Briefcasse
          services.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl space-y-4">
        {homeFaqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className="rounded-2xl border border-[#FFD94E] bg-white p-5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-lato text-base font-black text-letter1 md:text-lg">
                  {faq.question}
                </span>

                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-custom-blue text-white shadow-md">
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              {isOpen && (
                <p className="mt-4 max-w-3xl font-lato text-base font-semibold leading-8 text-gray-700">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}