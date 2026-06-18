import ServiceSlugClient from "./ServiceSlugClient";
import { SERVICES } from "../../config/services";
import {
  SITE,
  getReadableSlug,
  getServiceDescription,
  getServiceFaqs,
  getServiceTitle,
} from "../../config/site";

function getServiceBySlug(slug) {
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
  const image = service?.image || service?.images?.[0]?.url || SITE.logo;

  return {
    title,
    description,
    keywords: [
      `${title.toLowerCase()} India`,
      `${title.toLowerCase()} Chennai`,
      `${title.toLowerCase()} online`,
      `${title.toLowerCase()} documents`,
      `${title.toLowerCase()} process`,
      "legal services Chennai",
      "legal services India",
      SITE.name,
    ],
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE.name}`,
      description,
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
      title: `${title} | ${SITE.name}`,
      description,
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

  return [
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
      serviceType: service?.category || title,
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
          item: SITE.url,
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
