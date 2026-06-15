export const SITE = {
  name: "Briefcasse",
  legalName: "Briefcasse Legal Services",
  url: "https://briefcasse.com",
  logo: "/assets/brief_blue.webp",
  email: "admin@briefcasse.com",
  phone: "+91 9600606897",
  telephone: "+919600606897",
  address:
    "296, 10th Street, 3rd Main Road, Astalakshmi Nagar, Valasaravakam, Chennai - 116",
  locality: "Chennai",
  region: "Tamil Nadu",
  country: "IN",
};

export const SERVICE_API_URL = "https://brief-ewyr.onrender.com/api/services";

export function getReadableSlug(slug = "") {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getServiceTitle(service, slug = "") {
  return service?.seoTitle || service?.heading || service?.title || getReadableSlug(slug) || "Legal Service";
}

export function getServiceDescription(service, slug = "") {
  const title = getServiceTitle(service, slug);
  return (
    service?.metaDescription ||
    service?.description ||
    `${title} support in India from Briefcasse, Chennai. Get help with documents, process, filing timelines, compliance steps, and expert guidance for individuals, startups, and businesses.`
  );
}

export function getServiceFaqs(service, slug = "") {
  if (Array.isArray(service?.faqs) && service.faqs.length > 0) {
    return service.faqs;
  }

  const title = getServiceTitle(service, slug);
  const documents = Array.isArray(service?.documents)
    ? service.documents.slice(0, 4).map((item) => item?.name || item?.title || item).filter(Boolean)
    : [];

  return [
    {
      question: `What is ${title}?`,
      answer: `${title} is a professional legal, tax, compliance, or registration service where Briefcasse helps you understand requirements, prepare documents, and complete the filing or advisory process.`,
    },
    {
      question: `Who needs ${title}?`,
      answer:
        "This service is useful for individuals, startups, founders, business owners, and companies that need reliable legal or compliance support in India.",
    },
    {
      question: `What documents are required for ${title}?`,
      answer:
        documents.length > 0
          ? `Common documents include ${documents.join(", ")}. The exact list may change based on your case and government requirements.`
          : "Documents depend on your case. Briefcasse reviews your requirement and shares the exact checklist before starting the work.",
    },
    {
      question: `Can Briefcasse help with online ${title.toLowerCase()}?`,
      answer:
        "Yes. Briefcasse can guide you through online preparation, documentation, filing support, follow-ups, and next steps after submission.",
    },
  ];
}
