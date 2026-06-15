"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthGuard } from "../components/route/useAuthGuard";

const serviceCategories = [
  {
    title: "Startup",
    subTitle:
      "Fast, reliable registration support for founders and new businesses.",
    links: [
      { label: "Private Limited Company", slug: "company-incorporation" },
      { label: "Limited Liability Partnership", slug: "llp-incorporation" },
      { label: "MSME/Udyam Registration", slug: "msme-udyam" },
    ],
  },
  {
    title: "Intellectual Property",
    subTitle:
      "Protect your brand, creative work, designs, and innovation assets.",
    links: [
      { label: "Trademark Registration", slug: "trademark-registration" },
      { label: "Copyright Registration", slug: "copyright-registration" },
      { label: "Patent Filing", slug: "patent-filing" },
    ],
  },
  {
    title: "Tax Filing",
    subTitle:
      "Simple tax and GST support to keep your business compliant.",
    links: [
      { label: "GST Registration", slug: "gst-registration" },
      { label: "GST Return Filing", slug: "gst-filing" },
      { label: "Income Tax Filing", slug: "income-tax-filing" },
    ],
  },
  {
    title: "MCA Compliance",
    subTitle:
      "Company compliance support for filings, KYC, and annual requirements.",
    links: [
      { label: "ROC Annual Filing", slug: "roc-annual-filing" },
      { label: "DIN KYC", slug: "din-kyc" },
    ],
  },
  {
    title: "Registration",
    subTitle:
      "Business, license, and statutory registrations for everyday operations.",
    links: [
      { label: "FSSAI Registration", slug: "fssai-registration" },
      { label: "Import Export Code", slug: "import-export-code" },
      { label: "Shop & Establishment License", slug: "shop-establishment-license" },
    ],
  },
  {
    title: "Legal Advisory & Agreement",
    subTitle:
      "Clear agreements and legal guidance for business relationships.",
    links: [
      { label: "Service Agreement", slug: "service-agreement" },
      { label: "Founders Agreement", slug: "founders-agreement" },
      { label: "Mutual NDA", slug: "mutual-nda" },
    ],
  },
  {
    title: "Other Services",
    subTitle:
      "Focused consultation for business, legal, and compliance questions.",
    links: [{ label: "Legal Consultation", slug: "legal-consultation" }],
  },
];

export default function ServicePage() {
  const { loading: authLoading } = useAuthGuard(["user"]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10 max-w-3xl">
          <p className="font-anton text-3xl font-semibold tracking-wider text-custom-blue md:text-4xl">
            Services
          </p>
          <p className="mt-3 font-lato text-base font-bold leading-7 text-letter1 md:text-lg">
            Browse key service categories and open only the service you need.
            Each service detail page loads its own data instead of pulling the
            full catalogue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {serviceCategories.map((category) => (
            <article
              key={category.title}
              className="flex min-h-[320px] flex-col border border-custom-blue/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <h2 className="font-anton text-2xl font-semibold tracking-wider text-custom-blue">
                  {category.title}
                </h2>
                <p className="mt-3 font-lato text-sm font-bold leading-7 text-letter1">
                  {category.subTitle}
                </p>
              </div>

              <div className="mt-6 flex flex-1 flex-col gap-3">
                {category.links.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group flex items-center justify-between border border-custom-blue/10 px-4 py-3 font-lato text-sm font-extrabold text-custom-blue transition hover:border-starttext hover:bg-[#FFF7C7]"
                  >
                    <span>{service.label}</span>
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
