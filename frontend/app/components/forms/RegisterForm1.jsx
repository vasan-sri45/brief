"use client";
import { useState, useEffect } from "react";
import {
  useRegisterUser,
  useSendOtp,
  useVerifyOtp,
} from "../../hooks/useAuthMutations";

const RegisterForm1 = ({ handleClick }) => {
  const [isBusiness, setIsBusiness] = useState(false);
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  // 🆕 structured info state
  const [info, setInfo] = useState({ message: "", isError: false });

  const [stage, setStage] = useState("REGISTER"); // REGISTER | VERIFY

  const registerUser = useRegisterUser();
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const handleRadioChange = (event) =>
    setIsBusiness(event.target.value === "business");

  // 🔁 Auto fade after 4 secs (optional)
  useEffect(() => {
    if (!info.message) return;
    const timer = setTimeout(() => {
      setInfo({ message: "", isError: false });
    }, 4000);
    return () => clearTimeout(timer);
  }, [info]);

  const resendOtp = () => {
    if (!emailId) {
      setInfo({ message: "Enter email to receive OTP.", isError: true });
      return;
    }

    sendOtp.mutate(
      { email: emailId },
      {
        onSuccess: (data) => {
          const msg = data?.message || "OTP sent to your email.";
          setInfo({ message: msg, isError: false });
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || "Failed to send OTP.";
          setInfo({ message: msg, isError: true });
        },
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (stage === "REGISTER") {
      if (!fullName || !emailId || mobile.length !== 10) return;
      if (isBusiness && (!businessName || !businessType)) {
        setInfo({ message: "Business name & type required.", isError: true });
        return;
      }

      const registerPayload = {
        name: fullName,
        email: emailId,
        mobile,
        accountType: isBusiness ? "business" : "individual",
        businessName: isBusiness ? businessName : undefined,
        businessType: isBusiness ? businessType : undefined,
      };

      registerUser.mutate(registerPayload, {
        onSuccess: (data) => {
          setInfo({
            message: data?.message || "OTP sent to your email.",
            isError: false,
          });
          setStage("VERIFY");
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || "Registration failed.";
          setInfo({ message: msg, isError: true });
        },
      });
    } else {
      if (!otp || otp.length < 4) return;

      verifyOtp.mutate(
        { email: emailId, otp },
        {
          onSuccess: () => {
            setInfo({
              message: "Registration completed successfully.",
              isError: false,
            });
          },
          onError: (err) => {
            const msg =
              err?.response?.data?.message || "OTP verification failed.";
            setInfo({ message: msg, isError: true });
          },
        }
      );
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="w-full mb-3">
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-sm font-lato font-bold text-letter1"
          />
        </div>

        {/* Email */}
        <div className="w-full mb-3">
          <label htmlFor="emailId" className="sr-only">Email ID</label>
          <input
            id="emailId"
            type="email"
            placeholder="Email ID"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
            className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-sm font-lato font-bold text-letter1"
          />
        </div>

        {/* Mobile + OTP */}
        <div className="w-full mb-3">
          <div className="flex gap-2 mb-1">
            <div className={stage === "VERIFY" ? "w-8/12" : "w-full"}>
              <label htmlFor="mobile" className="sr-only">Mobile No</label>
              <input
                id="mobile"
                type="text"
                placeholder="Mobile No"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                minLength={10}
                maxLength={10}
                required
                className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-sm font-lato font-bold text-letter1"
              />
            </div>

            {stage === "VERIFY" && (
              <div className="w-4/12">
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  minLength={4}
                  maxLength={6}
                  required
                  className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-sm font-lato font-bold text-letter1"
                />
              </div>
            )}
          </div>

          {stage === "VERIFY" && (
            <button
              type="button"
              onClick={resendOtp}
              disabled={sendOtp.isPending}
              className="w-full text-right text-xs text-custom-blue  font-lato font-bold"
            >
              {sendOtp.isPending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Radio */}
        <div className="flex justify-between items-center w-10/12 mb-3">
          <label className="text-sm flex items-center gap-1 text-md font-lato font-bold text-letter1">
            <input
              type="radio"
              name="entity-type"
              value="individual"
              checked={!isBusiness}
              onChange={handleRadioChange}
              className="accent-custom-blue"
            />
            Individual
          </label>

          <label className="text-sm flex items-center gap-1 text-md font-lato font-bold text-letter1">
            <input
              type="radio"
              name="entity-type"
              value="business"
              checked={isBusiness}
              onChange={handleRadioChange}
              className="accent-custom-blue"
            />
            Business Entity
          </label>
        </div>

        {/* Business details */}
        <div className="min-h-[81px]">
          {isBusiness && (
            <>
              <div className="w-full mb-3">
                <label htmlFor="businessName" className="sr-only text-md font-lato font-bold text-letter1">
                  Business Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-md font-lato font-bold text-letter1"
                />
              </div>
              <div className="w-full mb-3">
                <label htmlFor="businessType" className="sr-only text-md font-lato font-bold text-letter1">
                  Business Type
                </label>
                <input
                  id="businessType"
                  type="text"
                  placeholder="Business Type"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  required
                  className="w-full h-10 pl-3 bg-white rounded-3xl shadow-lg-inner text-md font-lato font-bold text-letter1"
                />
              </div>
            </>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={registerUser.isPending || verifyOtp.isPending}
          className="w-full h-10 bg-custom-blue text-white rounded-3xl text-md font-lato font-bold mt-0lg:mt-20"
        >
          {stage === "REGISTER"
            ? registerUser.isPending
              ? "Submitting..."
              : "Submit"
            : verifyOtp.isPending
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-1.5 my-3">
          <div className="w-1/2 h-0.5 bg-custom-blue" />
          <span className="text-custom-blue text-sm">or</span>
          <div className="w-1/2 h-0.5 bg-custom-blue" />
        </div>

        {/* Login prompt */}
        <p className="text-center text-sm font-lato font-bold text-letter1">
          You already have an account?
          <button type="button" onClick={handleClick} className="text-custom-blue ml-1 text-md font-lato font-bold">
            Sign in
          </button>
        </p>
      </form>

      {info.message && (
        <p
          className={`mt-2 text-center text-xs ${
            info.isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {info.message}
        </p>
      )}
    </div>
  );
};

export default RegisterForm1;
