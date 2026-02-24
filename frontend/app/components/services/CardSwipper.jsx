"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { RxArrowTopRight } from "react-icons/rx";
import Link from "next/link";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const CardSwipper = ({ servicesData = [] }) => {

  const shortText = (text, length = 150) => {
  if (!text || typeof text !== "string") return "No description available";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

  if (!Array.isArray(servicesData) || servicesData.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 font-semibold">
        No services available
      </div>
    );
  }

  return (
    <div className="w-full mb-5">
      <Swiper
        spaceBetween={25}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 1.2 },
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2.5 },
          1280: { slidesPerView: 3 },
        }}
        freeMode
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full pb-12"
      >
        {servicesData.map((service) => (
          <SwiperSlide key={service._id}>
               
          
            {/* <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-custom-blue min-h-[350px] p-6 flex flex-col">

              
              <h3 className="text-lg font-anton text-custom-blue text-center mb-4">
                {service.heading}
              </h3>
               

              
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/brief_man.png"
                  alt="service"
                  width={64}
                  height={64}
                />
              </div>

              
              <p className="text-sm font-semibold text-gray-600 flex-grow">
                {service.description}
              </p>

              <Link
                  href={`/services/${service.slug}`}
                  className="flex justify-between items-center mt-6 group/link"
                >
                  <span className="text-custom-blue font-bold group-hover/link:underline">
                    Know More
                  </span>

                  <div className="w-10 h-10 bg-custom-blue rounded-full flex items-center justify-center transition-all duration-300 group-hover/link:scale-110 group-hover/link:bg-startbtn">
                    <RxArrowTopRight className="text-white group-hover/link:rotate-45 transition-transform duration-300" />
                  </div>
              </Link>

            </div>  */}

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-custom-blue h-[380px] p-6 flex flex-col">

            {/* TITLE */}
                <h3 className="text-lg font-anton text-custom-blue text-center mb-3 line-clamp-2 min-h-[48px]">
                  {service.heading}
                </h3>

                {/* IMAGE (FIXED AREA) */}
                <div className="h-32 w-full flex items-center justify-center mb-3">
                  <img
                    src={service?.images?.[0]?.url || "/placeholder.jpg"}
                    alt={service?.heading}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* DESCRIPTION (FLEX AREA) */}
                <p className="text-sm font-semibold text-gray-600 flex-grow line-clamp-4 overflow-hidden">
                  {shortText(service.description)}
                </p>

                {/* BUTTON (ALWAYS BOTTOM) */}
                <Link
                  href={`/services/${service.slug}`}
                  className="flex justify-between items-center mt-4 group/link"
                >
                  <span className="text-custom-blue font-bold group-hover/link:underline">
                    Know More
                  </span>

                  <div className="w-10 h-10 bg-custom-blue rounded-full flex items-center justify-center transition-all duration-300 group-hover/link:scale-110">
                    <RxArrowTopRight className="text-white group-hover/link:rotate-45 transition-transform duration-300" />
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