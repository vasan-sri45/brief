"use client";

import { useState } from "react";
import { useEmployeeLogin } from "../../hooks/useEmployeeAuthMutations";

const EmployeeLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const login = useEmployeeLogin();

  // ✅ same behavior as OTP form
  const canSubmit = email && password;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setErrorMsg("");

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          setErrorMsg(
            err?.response?.data?.message || "Invalid credentials"
          );
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* ================= EMAIL ================= */}
        <div className="w-full h-8 lg:h-10 xl:h-12">
          <input
            type="email"
            placeholder="Company E-mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-full pl-3 bg-white rounded-3xl outline-none border-none shadow-lg-inner text-sm font-lato font-bold text-letter1"
          />
        </div>

        {/* ================= PASSWORD ================= */}
        <div className="w-full h-8 mt-5 lg:h-10 lg:mt-7 xl:h-12">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-full pl-3 bg-white rounded-3xl outline-none border-none shadow-lg-inner text-sm font-lato font-bold text-letter1"
          />
        </div>

        {/* ================= ERROR ================= */}
        {errorMsg && (
          <p className="mt-2 text-center text-xs text-red-500">
            {errorMsg}
          </p>
        )}

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          disabled={!canSubmit || login.isPending}
          className="w-full mt-7 lg:mt-24 bg-custom-blue text-white rounded-3xl
                     text-md font-lato font-bold py-3
                     text-center 
                     disabled:opacity-60"
        >
          {login.isPending ? "Signing in..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeLoginForm;
