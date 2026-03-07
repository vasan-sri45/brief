// components/auth/LoginFormImage.jsx
"use client";
import Image from "next/image";
import BriefCasseBuilding from "../../../public/assets/brief_casse_building.png";
import Briefbuilding1 from "../../../public/assets/building1.jpg";
import Briefbuilding2 from "../../../public/assets/building2.jpg";
import { MdArrowOutward } from "react-icons/md";
import { FiArrowDownLeft } from "react-icons/fi";

const LoginFormImage = () => {
  const images = [BriefCasseBuilding, Briefbuilding1, Briefbuilding2]; // for future use (slider etc.)

  return (
    <div className="hidden md:flex min-h-screen justify-start items-center md:w-6/12">
      <div className="relative w-full sm:w-11/12 lg:max-w-lg h-[550px] lg:h-[600px] xl:h-[640px] bg-custom-blue rounded-3xl">
        <Image
          src={BriefCasseBuilding}
          alt="building"
          className="mt-5 w-full h-[450px] lg:h-[480px] xl:h-[520px] ml-1.5"
        />

        {/* Top text */}
        <div className="absolute top-5 left-5">
          <p className="text-md lg:text-lg text-white font-anton font-normal tracking-wider">
            Online Private Limited (PVT Ltd)
          </p>
          <p className="text-md lg:text-lg text-white font-anton font-normal tracking-wider">
            Company Registration in India
          </p>
        </div>

        {/* Bottom overlay card */}
        <div className="absolute bottom-3 lg:bottom-10 w-full h-[150px] z-50">
          <div className="w-11/12 mx-auto rounded-3xl bg-white/10 backdrop-blur-md">
            <div className="flex justify-center items-center gap-6 lg:gap-8 xl:gap-14 pt-4">
              {/* Start Today pill */}
              <div className="flex items-center pt-0 pb-0 lg:pt-3 lg:pb-2">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white flex justify-center items-center" />
                <div className="w-32 h-9 lg:w-40 lg:h-12 -ml-4 rounded-full border-2 border-white flex justify-center items-center">
                  <span className="text-white text-md lg:text-lg font-anton font-normal">
                    Start Today
                  </span>
                </div>
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-4">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-2 border-white flex justify-center items-center">
                  <button className="text-white text-3xl lg:text-4xl outline-none border-none">
                    <FiArrowDownLeft />
                  </button>
                </div>
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-2 border-white flex justify-center items-center">
                  <button className="text-white text-3xl lg:text-4xl outline-none border-none">
                    <MdArrowOutward />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-11/12 mx-auto mt-3 pb-5">
              <p className="text-white text-tiny lg:text-lg-tiny text-center lg:text-left font-lato font-bold">
                Learn about the history, usage and variations of Lorem Ipsum,
                the industry&apos;s standard dummy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormImage;
