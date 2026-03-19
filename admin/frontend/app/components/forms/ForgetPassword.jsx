"use client";
import { useState } from "react";
import Image from "next/image";
import FormFooter from "./FormFooter";
import BriefCasse from "../../../public/assets/brief_white.png";

import {
  useSendForgotOtp,
  useVerifyOtp,
  useResetPassword,
} from "../../hooks/useEmployeeAuthMutations";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const sendOtp = useSendForgotOtp();
  const verifyOtp = useVerifyOtp();
  const resetPassword = useResetPassword();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">

      {/* ================= CARD ================= */}
      <div className="w-11/12 md:max-w-md lg:max-w-lg rounded-3xl p-8 bg-custom-blue
        text-white shadow-xl">

        {/* ===== LOGO ===== */}
        <div className="flex items-center gap-1 mb-1">
          <Image src={BriefCasse} alt="logo" className="w-10" />
          <p className="text-[1.7rem] font-anton tracking-wide mt-[5px] font-normal">
            BRIEFCASSE
          </p>
        </div>

        {/* ===== TEXT ===== */}
        <div className="mb-6">
          <p className="text-xl font-anton font-normal">
            Welcome to BriefCasse
          </p>
          <p className="text-md mt-1 font-lato font-bold">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
          </p>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp.mutate(form.email, {
                onSuccess: (data) => {
                  alert(data.message);
                  if (data.success) setStep(2);
                },
              });
            }}
            className="space-y-6"
          >
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/70 
              focus:outline-none focus:border-white py-2 placeholder-white/70"
            />

            <button className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">
              {sendOtp.isPending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp.mutate(
                { email: form.email, otp: form.otp },
                {
                  onSuccess: (data) => {
                    alert(data.message);
                    if (data.success) setStep(3);
                  },
                }
              );
            }}
            className="space-y-6"
          >
            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/70 
              focus:outline-none focus:border-white py-2 placeholder-white/70"
            />

            <button className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">
              {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword.mutate(form, {
                onSuccess: (data) => {
                  alert(data.message);
                  if (data.success) {
                    setStep(1);
                    setForm({ email: "", otp: "", newPassword: "" });
                  }
                },
              });
            }}
            className="space-y-6"
          >
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/70 
              focus:outline-none focus:border-white py-2 placeholder-white/70"
            />

            <button className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-cyan-400 to-blue-400 font-bold">
              {resetPassword.isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="w-11/12 md:max-w-md lg:max-w-lg 
        h-[90px] lg:h-[120px] rounded-3xl bg-custom-blue shadow-md">
        <div className="h-full flex items-center justify-center">
          <FormFooter />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;