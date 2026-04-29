import ServiceSlugClient from "./ServiceSlugClient";

export async function generateMetadata({ params }) {
  
  const { slug } = await params;

  try {
    const res = await fetch(
      `https://brief-ewyr.onrender.com/api/services`,
      { cache: "no-store" }
    );

    if (!res.ok) return fallbackMetadata();

    const data = await res.json();
    const service = data?.items?.find((s) => s.slug === slug);

    if (!service) return fallbackMetadata();

    return {
      title: service?.heading || "Legal Service",
      description:
        service?.description ||
        `${service?.heading} — Reliable trademark & legal services by Briefcasse.`,
      alternates: {
        canonical: `/services/${slug}`,
      },
      openGraph: {
        type: "website",
        title: `${service?.heading || "Legal Service"} | Briefcasse`,
        description:
          service?.description ||
          "Easy and reliable trademark registration and legal services.",
        url: `https://www.briefcasse.com/services/${slug}`,
        siteName: "Briefcasse",
        images: [
          {
            url: service?.image || "/assets/brief_blue.png",
            width: 1200,
            height: 630,
            alt: service?.heading || "Briefcasse Legal Service",
          },
        ],
        locale: "en_IN",
      },
      twitter: {
        card: "summary_large_image",
        title: `${service?.heading || "Legal Service"} | Briefcasse`,
        description:
          service?.description ||
          "Easy and reliable trademark registration and legal services.",
        images: [service?.image || "/assets/brief_blue.png"],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return fallbackMetadata();
  }
}

function fallbackMetadata() {
  return {
    title: "Legal Services | Briefcasse",
    description:
      "Briefcasse offers easy and reliable trademark registration and legal services.",
    openGraph: {
      title: "Legal Services | Briefcasse",
      images: [{ url: "/assets/brief_blue.png" }],
    },
  };
}

export default async function ServiceSlugPage({ params }) {
  
  const { slug } = await params;
  return <ServiceSlugClient />;
}