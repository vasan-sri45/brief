"use client";
import Image from "next/image";
import UserOtpLoginForm from "./Form";
import FormFooter from "./FormFooter";

const LoginForm = ({ handleClick }) => {
  return (
    <div className="w-full md:w-6/12 md:max-w-[550px] md:h-[700px] flex flex-col justify-center items-center gap-1">
      
      {/* ================= CARD ================= */}
      <div className="bg-custom-blue w-full h-[520px] md:flex-1 rounded-3xl">
        <div className="w-5/6 mx-auto pt-2">

          {/* ===== LOGO ===== */}
          <div className="flex items-center gap-1 pt-4">
            <div className="flex justify-center items-center">
              <Image
                src="/assets/brief_white.webp"
                alt="Briefcasse logo"
                width={32}
                height={32}
                unoptimized
                className="h-auto w-8 rounded"
              />
            </div>

            {/* <div className="w-20 h-7"> */}
              <p className="text-[1.1rem] lg:text-[1.3rem] font-anton text-normal text-white uppercase tracking-wide mt-1.5">
                Briefcasse
              </p>
            {/* </div> */}
          </div>

          {/* ===== TEXT ===== */}
          <div className="mt-3">
            <p className="text-xl font-anton font-normal text-white tracking-wide uppercase">
              Welcome to BriefCasse
            </p>
            <p className="text-sm text-white font-anton font-normal mt-1 pt-3 tracking-wide">
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
      <div className="bg-custom-blue w-full h-[90px] md:h-[135px] rounded-3xl">
        <div className="h-full flex items-center justify-center">
          <FormFooter />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
