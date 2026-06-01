import ServiceSlugClient from "./ServiceSlugClient";
import { SERVICES } from "../../config/services";
import {
  SERVICE_API_URL,
  SITE,
  getServiceImage,
  getServiceKeywords,
  getReadableSlug,
  getServiceDescription,
  getServiceFaqs,
  getServiceTitle,
} from "../../config/site";

async function getServiceBySlug(slug) {
  try {
    const res = await fetch(SERVICE_API_URL, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error("Service request failed");
    }

    const data = await res.json();
    const service = data?.items?.find((item) => item.slug === slug);

    if (service) {
      return service;
    }
  } catch {
    // Fall through to the local service index so pages still render for crawlers.
  }

  const localService = SERVICES.find((item) => item.slug === slug);
  if (!localService) return null;

  return {
    ...localService,
    heading: localService.title,
    description: localService.summary,
  };
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const title = getServiceTitle(service, slug);
  const description = getServiceDescription(service, slug).slice(0, 155);
  const image = getServiceImage(service);
  const canonical = service?.canonicalUrl || `/services/${slug}`;
  const ogTitle = service?.openGraphTitle || `${title} | ${SITE.name}`;
  const ogDescription = service?.openGraphDescription || description;

  return {
    title,
    description,
    keywords: getServiceKeywords(service, title),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      url: `${SITE.url}/services/${slug}`,
      siteName: SITE.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} by ${SITE.name}`,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function buildServiceSchema(service, slug) {
  const title = getServiceTitle(service, slug);
  const description = getServiceDescription(service, slug);
  const faqs = getServiceFaqs(service, slug);
  const customSchema = parseSchemaJson(service?.schemaMarkupJson);

  return [
    ...(customSchema ? [customSchema] : []),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      provider: {
        "@type": "LegalService",
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address,
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          addressCountry: SITE.country,
        },
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      serviceType: service?.serviceCategory || service?.category || title,
      url: `${SITE.url}/services/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE.url}/serviced`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: `${SITE.url}/services/${slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

function parseSchemaJson(schemaMarkupJson) {
  if (!schemaMarkupJson) return null;

  try {
    return JSON.parse(schemaMarkupJson);
  } catch {
    return null;
  }
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const title = getServiceTitle(service, slug);
  const description = getServiceDescription(service, slug);
  const faqs = getServiceFaqs(service, slug);
  const schema = buildServiceSchema(service, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServiceSlugClient
        initialService={service}
        initialSeo={{
          title,
          description,
          faqs,
          readableSlug: getReadableSlug(slug),
        }}
      />
    </>
  );
}
