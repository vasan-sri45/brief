"use client";

import React, { useState } from "react";
import { useOtpLogin, useSendOtp } from "../../hooks/useAuthMutations";

const UserOtpLoginForm = ({ handleClick }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [info, setInfo] = useState("");

  const otpLogin = useOtpLogin();
  const sendOtp = useSendOtp();

  const canSubmit = email && otp.length >= 4;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    otpLogin.mutate(
      { email, otp },
      {
        onError: (err) => {
          setInfo(
            err?.response?.data?.message || "OTP verification failed"
          );
        },
      }
    );
  };

  const handleSendOtp = () => {
    if (!email) {
      setInfo("Please enter email.");
      return;
    }

    sendOtp.mutate(
      { email },
      {
        onSuccess: (data) => {
          setInfo(data?.message || "OTP sent to your email.");
        },
        onError: (err) => {
          setInfo(
            err?.response?.data?.message || "Failed to send OTP."
          );
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <div className="w-full h-8 lg:h-10 xl:h-12">
          <input
            type="email"
            placeholder="E-mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-full pl-3 bg-white rounded-3xl outline-none shadow-lg-inner font-lato font-bold text-letter1"
          />
        </div>

        {/* OTP */}
        <div className="relative w-full h-8 mt-5 lg:h-10 xl:h-12">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            minLength={4}
            maxLength={6}
            className="w-full h-full pl-3 pr-24 bg-white rounded-3xl outline-none shadow-lg-inner font-lato font-bold text-letter1"
          />

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={!email || sendOtp.isPending}
            className="absolute right-2 top-1.5 px-3 rounded-full bg-custom-blue disabled:opacity-60 font-lato font-bold text-white tracking-wide text-xs lg:text-lg py-1"
          >
            {sendOtp.isPending ? "Sending..." : "Send OTP"}
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!canSubmit || otpLogin.isPending}
          className="w-full mt-5 bg-custom-blue text-white rounded-3xl disabled:opacity-60 font-lato font-bold py-2"
        >
          {otpLogin.isPending ? "Verifying..." : "Submit"}
        </button>
      </form>

      {info && (
        <p className="mt-2 text-center text-xs text-red-500">
          {info}
        </p>
      )}

      <div className="hidden md:flex items-center gap-1.5 my-3">
          <div className="w-1/2 h-0.5 bg-custom-blue" />
          <span className="text-custom-blue text-sm">or</span>
          <div className="w-1/2 h-0.5 bg-custom-blue" />
        </div>

      <p className="text-center text-sm mt-4 font-lato font-bold text-letter1">
        You don&apos;t have an account?
        <button
          type="button"
          onClick={handleClick}
          className="ml-1 text-custom-blue font-lato font-bold"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default UserOtpLoginForm;
