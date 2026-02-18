"use client";
import Image from "next/image";
import UserOtpLoginForm from "./Form";
import FormFooter from "./FormFooter";
import BriefCasse from "../../../public/assets/brief_blue.png";

const LoginForm = ({ handleClick }) => {
  return (
    <div className="w-full md:w-6/12 min-h-screen flex flex-col justify-center items-center md:items-end gap-1">
      
      {/* ================= CARD ================= */}
      <div className="bg-beige w-11/12 lg:max-w-lg h-[420px] lg:h-[500px] rounded-3xl">
        <div className="w-5/6 mx-auto pt-2">

          {/* ===== LOGO ===== */}
          <div className="flex items-center gap-1 pt-4">
            <div className="flex justify-center items-center">
              <Image src={BriefCasse} alt="logo" className="w-6 rounded" />
            </div>

            <div className="w-20 h-7 mt-3">
              <p className="text-[1.1rem] font-anton text-normal text-custom-blue mt-[-3px]">
                Briefcasse
              </p>
            </div>
          </div>

          {/* ===== TEXT ===== */}
          <div className="mt-3">
            <p className="text-xl font-anton font-normal text-custom-blue">
              Welcome to BriefCasse
            </p>
            <p className="text-sm text-letter1 font-anton font-normal mt-1">
              Login to continue
            </p>
          </div>

          {/* ===== USER OTP FORM ONLY ===== */}
          <div className="mt-6">
            <UserOtpLoginForm handleClick={handleClick} />
          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="bg-beige w-11/12 lg:max-w-lg h-[80px] lg:h-[135px] rounded-3xl">
        <div className="h-full flex items-center justify-center">
          <FormFooter />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
