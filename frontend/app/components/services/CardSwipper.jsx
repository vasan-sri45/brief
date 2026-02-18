"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import { RxArrowTopRight } from 'react-icons/rx';
import {ArrowRight} from "lucide-react";
import BriefMan from "../../../public/assets/brief_man.png";
import BriefMan1 from "../../../public/assets/brief_man1.png";
import BriefMan2 from "../../../public/assets/brief_man2.png";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const services = [
  {
    id: 1,
    icon: BriefMan,
    title: 'Digital Solutions',
    description: 'Comprehensive digital transformation services that help businesses modernize their operations.'
  },
  {
    id: 2,
    icon: BriefMan1,
    title: 'Team Management',
    description: 'Expert team coordination and project management solutions designed to maximize productivity.'
  },
  {
    id: 3,
    icon: BriefMan2,
    title: 'Growth Analytics',
    description: 'Advanced analytics and insights to drive business growth through data-driven decisions.'
  },
  {
    id: 4,
    icon: BriefMan,
    title: 'Security First',
    description: 'Enterprise-grade security solutions that protect your digital assets and ensure compliance.'
  },
  {
    id: 5,
    icon: BriefMan1,
    title: 'Performance',
    description: 'High-performance optimization services that enhance system efficiency and user experiences.'
  },
  {
    id: 6,
    icon: BriefMan2,
    title: 'Global Reach',
    description: 'Expand your business globally with our international expansion strategies.'
  }
];

const HomeSlider = () => {
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
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full pb-12 sm:pb-16"
      >
        {services.map(({ id, icon, title, description }) => (
          <SwiperSlide key={id}>
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border-3 border-custom-blue min-h-[280px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[400px]">
              <div className="absolute inset-0 bg-beige opacity-0 group-hover:opacity-10 transition-opacity duration-300 " />

              <div className="relative py-6 sm:p-8 h-full flex flex-col">
                <h3 className="text-lg sm:text-xl font-anton font-bold text-custom-blue mb-3 sm:mb-4 text-center transition-colors duration-300 tracking-wider">
                  {title}
                </h3>

                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center">
                    <Image src={icon} alt={title} className="w-16 h-16 object-contain" />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-letter1 font-bold leading-relaxed flex-grow mb-4 sm:mb-6 text-justify p-2 md:p-0">
                  {description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs sm:text-sm font-lato font-bold text-custom-blue">
                    Know More
                  </span>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-custom-blue rounded-full flex items-center justify-center transition-all duration-300">
                    <RxArrowTopRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
                  </div> 
          
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;

