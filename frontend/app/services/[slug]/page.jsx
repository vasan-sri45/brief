// import ServiceSlugClient from "./ServiceSlugClient";

// export async function generateMetadata({ params }) {
  
//   const { slug } = await params;

//   try {
//     const res = await fetch(
//       `https://brief-ewyr.onrender.com/api/services`,
//       { cache: "no-store" }
//     );

//     if (!res.ok) return fallbackMetadata();

//     const data = await res.json();
//     const service = data?.items?.find((s) => s.slug === slug);

//     if (!service) return fallbackMetadata();

//     return {
//       title: service?.heading || "Legal Service",
//       description:
//         service?.description ||
//         `${service?.heading} — Reliable trademark & legal services by Briefcasse.`,
//       alternates: {
//         canonical: `/services/${slug}`,
//       },
//       openGraph: {
//         type: "website",
//         title: `${service?.heading || "Legal Service"} | Briefcasse`,
//         description:
//           service?.description ||
//           "Easy and reliable trademark registration and legal services.",
//         url: `https://www.briefcasse.com/services/${slug}`,
//         siteName: "Briefcasse",
//         images: [
//           {
//             url: service?.image || "/assets/brief_blue.png",
//             width: 1200,
//             height: 630,
//             alt: service?.heading || "Briefcasse Legal Service",
//           },
//         ],
//         locale: "en_IN",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: `${service?.heading || "Legal Service"} | Briefcasse`,
//         description:
//           service?.description ||
//           "Easy and reliable trademark registration and legal services.",
//         images: [service?.image || "/assets/brief_blue.png"],
//       },
//       robots: {
//         index: true,
//         follow: true,
//       },
//     };
//   } catch {
//     return fallbackMetadata();
//   }
// }

// function fallbackMetadata() {
//   return {
//     title: "Legal Services | Briefcasse",
//     description:
//       "Briefcasse offers easy and reliable trademark registration and legal services.",
//     openGraph: {
//       title: "Legal Services | Briefcasse",
//       images: [{ url: "/assets/brief_blue.png" }],
//     },
//   };
// }

// export default async function ServiceSlugPage({ params }) {
  
//   const { slug } = await params;
//   return <ServiceSlugClient />;
// }


import ServiceSlugClient from "./ServiceSlugClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `https://brief-ewyr.onrender.com/api/services`,
      { cache: "no-store" }
    );

    if (!res.ok) return fallbackMetadata(slug);

    const data = await res.json();
    const service = data?.items?.find((s) => s.slug === slug);

    if (!service) return fallbackMetadata(slug);

    
    const readableSlug = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    
    const title = service?.heading || readableSlug;

    
    const description =
      service?.description ||
      `${title} in India — Fast, reliable and affordable ${title.toLowerCase()} services for startups and businesses. Expert support by Briefcasse, Chennai.`;

    return {
      //Title — keyword + brand
      title: `${title} | Briefcasse`,

      //Description
      description: description.slice(0, 155),

      // Keywords — service-specific
      keywords: [
        `${title.toLowerCase()} India`,
        `${title.toLowerCase()} online`,
        `${title.toLowerCase()} Chennai`,
        `${title.toLowerCase()} for startups`,
        "legal services India",
        "Briefcasse",
      ],

      alternates: {
        canonical: `/services/${slug}`,
      },

      openGraph: {
        type: "website",
        title: `${title} | Briefcasse — Legal Services India`,
        description: description.slice(0, 155),
        url: `https://briefcasse.com/services/${slug}`,
        siteName: "Briefcasse",
        images: [
          {
            url: service?.image || "/assets/brief_blue.png",
            width: 1200,
            height: 630,
            alt: `${title} — Briefcasse Legal Services`,
          },
        ],
        locale: "en_IN",
      },

      twitter: {
        card: "summary_large_image",
        title: `${title} | Briefcasse`,
        description: description.slice(0, 155),
        images: [service?.image || "/assets/brief_blue.png"],
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return fallbackMetadata(slug);
  }
}

function fallbackMetadata(slug = "") {
  const readableSlug = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${readableSlug || "Legal Service"} | Briefcasse`,
    description:
      "Briefcasse offers easy and reliable trademark registration and legal services for startups and businesses in India.",
    openGraph: {
      title: `${readableSlug || "Legal Services"} | Briefcasse`,
      images: [{ url: "/assets/brief_blue.png" }],
    },
  };
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  return <ServiceSlugClient />;
}