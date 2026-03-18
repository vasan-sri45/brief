"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";
import { RxArrowTopRight } from "react-icons/rx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CardSwipper = ({ servicesData = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const shortText = (text, length = 120) => {
    if (!text || typeof text !== "string") return "No description available";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (!servicesData?.length) {
    return <div className="text-center py-10">No services available</div>;
  }

  return (
    <div className="relative w-full py-2">

      {/* LEFT ARROW */}
      <button
        ref={prevRef}
        className="
          absolute z-20
          top-1/2 -translate-y-1/2
          w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
          rounded-full border-2 border-custom-blue text-custom-blue
          hover:border-startbtn hover:text-startbtn transition
          hidden sm:flex items-center justify-center

          -left-3 sm:left-2 md:left-4 lg:-left-14
        "
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT ARROW */}
      <button
        ref={nextRef}
        className="
          absolute z-20
          top-1/2 -translate-y-1/2
          w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
          rounded-full border-2 border-custom-blue text-custom-blue
          hover:border-startbtn hover:text-startbtn transition
          hidden sm:flex items-center justify-center

          -right-3 sm:right-2 md:right-4 lg:-right-14
        "
      >
        <ChevronRight size={20} />
      </button>

      <Swiper
        spaceBetween={25}
        slidesPerView={1}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          480: { slidesPerView: 1.15 },
          640: { slidesPerView: 1.4 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        modules={[FreeMode, Pagination, Navigation, Autoplay]}
        className="px-3 sm:px-6 md:px-12 pb-14"
      >
        {servicesData.map((service) => (
          <SwiperSlide key={service._id}>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-custom-blue hover:border-startbtn min-h-[380px] p-6 flex flex-col">

              {/* TITLE */}
              <h3 className="text-lg font-anton text-custom-blue text-center mb-3 line-clamp-2 min-h-[48px]">
                {service.heading}
              </h3>

              {/* IMAGE */}
              <div className="h-32 w-full flex items-center justify-center mb-3">
                <img
                  src={service?.images?.[0]?.url || "/assets/brief_man.png"}
                  alt={service?.heading}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm font-semibold text-gray-600 flex-grow line-clamp-4">
                {shortText(service.description)}
              </p>

              {/* BUTTON */}
              <Link
                href={`/services/${service.slug}`}
                className="flex justify-between items-center mt-4"
              >
                <span className="text-custom-blue font-bold">Know More</span>

                <div className="w-10 h-10 bg-starttext rounded-full flex items-center justify-center group-hover:scale-110 transition">
                  <RxArrowTopRight className="text-custom-blue group-hover:rotate-45 transition text-xl" />
                </div>
              </Link>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardSwipper;