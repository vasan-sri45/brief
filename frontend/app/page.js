import Home from "./components/common/Home";

const categories = [
  {
    title: "Startup",
    subTitle:
      "We provide fast, reliable, and hassle-free registration services to help individuals and businesses stay legally compliant with ease.",
    links: [
      { label: "Company Incorporation", slug: "company-incorporation" },
      { label: "LLP Incorporation", slug: "llp-incorporation" },
    ],
  },
  {
    title: "Intellectual Property",
    subTitle:
      "We offer comprehensive intellectual property services to protect, manage, and enforce your ideas, innovations, and brand assets effectively.",
    links: [
      { label: "Trademark Registration", slug: "trademark-registration" },
      { label: "Copyright Registration", slug: "copyright-registration" },
      { label: "Patent Filing", slug: "patent-filing" },
    ],
  },
  {
    title: "Tax Filing",
    subTitle:
      "We provide accurate and hassle-free tax filing services to help individuals and businesses stay compliant and stress-free.",
    links: [
      { label: "GST Registration", slug: "gst-registration" },
      { label: "Income Tax Filing", slug: "income-tax-filing" },
    ],
  },
  {
    title: "MCA Compliance",
    subTitle:
      "We assist in filing and managing MCA compliance requirements smoothly.",
    links: [{ label: "ROC Annual Filing", slug: "roc-annual-filing" }],
  },
  {
    title: "Registration",
    subTitle:
      "We offer quick and reliable registration services to help individuals and businesses complete legal formalities with ease and confidence.",
    links: [
      { label: "FSSAI Registration", slug: "fssai-registration" },
      { label: "Import Export Code", slug: "import-export-code" },
    ],
  },
  {
    title: "Legal Advisory & Agreement",
    subTitle:
      "We provide expert legal advisory and agreement drafting services to protect your interests and ensure clear business relationships.",
    links: [
      { label: "Service Agreement", slug: "service-agreement" },
      { label: "Mutual NDA", slug: "mutual-nda" },
    ],
  },
  {
    title: "Other Services",
    subTitle:
      "We offer a wide range of professional services tailored to diverse legal, compliance, and business support needs.",
    links: [{ label: "Legal Consultation", slug: "legal-consultation" }],
  },
];

export default function Page() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <h1>Trademark Registration & Legal Services India</h1>
        <p>
          Briefcasse offers easy and reliable trademark registration and legal
          services for startups, entrepreneurs, and businesses in India.
        </p>

        {categories.map((cat) => (
          <div key={cat.title}>
            <h2>{cat.title}</h2>
            <p>{cat.subTitle}</p>
            <ul>
              {cat.links.map((service) => (
                <li key={service.slug}>
                  <a href={`/services/${service.slug}`}>{service.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Home />
    </>
  );
}
