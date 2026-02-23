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
               
          
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-custom-blue min-h-[350px] p-6 flex flex-col">

              {/* SUB SERVICE NAME */}
              <h3 className="text-lg font-anton text-custom-blue text-center mb-4">
                {service.heading}
              </h3>
               

              {/* ICON */}
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/brief_man.png"
                  alt="service"
                  width={64}
                  height={64}
                />
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm font-semibold text-gray-600 flex-grow">
                {service.description}
              </p>

              {/* <div className="flex justify-between items-center mt-6">
                <span className="text-custom-blue font-bold">
                  Know More
                </span>

                <div className="w-10 h-10 bg-custom-blue rounded-full flex items-center justify-center">
                  <RxArrowTopRight className="text-white group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div> */}

              <Link
                  href={`/services/${service.slug}`}
                  className="flex justify-between items-center mt-6 group/link"
                >
                  <span className="text-custom-blue font-bold group-hover/link:underline">
                    Know More
                  </span>

                  <div className="w-10 h-10 bg-custom-blue rounded-full flex items-center justify-center transition-all duration-300 group-hover/link:scale-110">
                    <RxArrowTopRight className="text-white group-hover/link:rotate-45 group-hover/link:text-starttext transition-transform duration-300" />
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