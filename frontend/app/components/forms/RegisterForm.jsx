
"use client";
import Image from "next/image";
import RegisterForm1 from "./RegisterForm1";
import BriefCasse from "../../../public/assets/brief_white.png";
import FormFooter from "./FormFooter";

const RegisterForm = ({ handleClick }) => {
  return (
    <div className="w-full md:w-6/12 min-h-screen flex flex-col justify-center  items-center md:items-end px-4 md:px-0 gap-1">
      {/* Card Container */}
      <div className="bg-custom-blue w-full  lg:max-w-lg rounded-3xl h-[520px] lg:h-[520px] xl:h-[550px]">
        <div className="w-11/12 mx-auto">
          

          {/* ===== LOGO ===== */}
          <div className="flex items-center gap-1 pt-4">
            <div className="flex justify-center items-center">
              <Image src={BriefCasse} alt="logo" className="w-8 rounded" />
            </div>

            <div className="w-20 h-7 mt-3">
              <p className="text-[1.1rem] font-anton text-normal text-white mt-[-3px] uppercase tracking-wide">
                Briefcasse
              </p>
            </div>
          </div>
          {/* Title */}
          <div className="w-full mt-1">
            <p className="text-sm lg:text-lg font-bold font-lato tracking-wider text-white">
              Auto Piolot Your Legal Liabilities
            </p>
          </div>
          {/* Register Form */}
          <div className="mt-2">
            <RegisterForm1 handleClick={handleClick} />
          </div>
        </div>

      </div>
      
           {/* ================= FOOTER ================= */}
      <div className="bg-custom-blue w-full lg:max-w-lg h-[90px] md:h-[125px] lg:h-[135px] rounded-3xl">
        <div className="h-full flex items-center justify-center">
          <FormFooter />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
