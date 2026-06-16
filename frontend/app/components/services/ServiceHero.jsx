"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import HeroButton from "./HeroButton";
import { useSelector } from "react-redux";

const ServiceHero = ({ service }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  // 🎯 GSAP hooks
  const descriptionText =
    service?.description ||
    "Want to register your Private Limited Company? We've got you covered!";

  const handleStartService = () => {
  if (!service?.slug) return;

  const pricingUrl = `/services/${service.slug}/pricing`;

  if (user) {
    router.push(pricingUrl);
  } else {
    
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
};


  return (
    <section className="w-full pt-1 ">
      <div className="w-full mx-auto px-4 pt-0 pb-2  lg:w-10/12 lg:p-0">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1.2fr] lg:gap-6">
          <div>

            <p className="mt-3 max-w-3xl leading-7 font-lato font-normal text-[0.9rem] md:text-[1rem] text-justify text-letter1 md:mt-4 md:leading-8 lg:max-w-xl">
              {descriptionText}
            </p>
            <HeroButton handleStartService={handleStartService}/>
          </div>

          <div className="
            relative
            w-full
            h-44
            sm:h-52
            md:h-64
            lg:h-72
            rounded-xl
            overflow-hidden
            shadow-lg
          ">

            {service?.images?.[0]?.url && (
              <Image
                src={service.images[0].url}
                alt={service?.heading || "Briefcasse service"}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover object-center"
              />
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
