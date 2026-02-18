
"use client";
import Image from "next/image";
import BriefCasse from "../../../public/assets/brief_casse.png";
import BriefHeading from "../../../public/assets/brief_heading.png";
import RegisterForm1 from "./RegisterForm1";

const RegisterForm = ({ handleClick }) => {
  return (
    <div className="w-full md:w-6/12 min-h-screen flex justify-center md:justify-end items-center px-4 md:px-0 py-6 gap-1">
      {/* Card Container */}
      <div className="bg-beige w-full sm:w-11/12 lg:max-w-lg rounded-3xl py-6 sm:py-8 lg:py-10 h-[550px] lg:h-[600px] xl:h-[640px]">
        <div className="w-11/12 mx-auto">
          {/* Logo & Heading */}
          <div className="flex items-center gap-2 pt-2">
            <div className="w-10 h-10 rounded-lg bg-white shadow-inner flex justify-center items-center">
              <Image src={BriefCasse} alt="logo" className="w-6 rounded" />
            </div>
            <div className="w-20 h-7 mt-3 lg:w-22 lg:h-8">
              <Image src={BriefHeading} alt="heading" className="w-full h-full object-contain" />
            </div>
          </div>
          {/* Title */}
          <div className="w-full mt-2">
            <p className="text-lg lg:text-xl xl:text-2xl font-medium font-poppins tracking-widest">
              Start Here. Right Now.
            </p>
          </div>
          {/* Register Form */}
          <div className="mt-2 lg:mt-2">
            <RegisterForm1 handleClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
