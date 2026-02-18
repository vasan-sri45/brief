"use client";

import React, { useState } from "react";
import FloatingInput from "./FloatingInput";
import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";
import { useCreatePaidService } from "../../hooks/useService";

const TicketRaiseForm = () => {

  const createService = useCreatePaidService();
  const headingRef = useGsapSectionHeading(0.2);
  const underlineRef = useGsapUnderlineLoop();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    service: "",
    clientType: "previous",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Ticket Raise Data:", formData);
  // };

  const handleSubmit = (e) => {
  e.preventDefault();

  createService.mutate({
    customerName: `${formData.firstName} ${formData.lastName}`,
    customerMobile: formData.mobile,
    customerEmail: formData.email,
    serviceType: "Paid Service",
    service: formData.service,
    paymentMode: "Cash",
    totalPayment: 0,
    notes: `Client Type: ${formData.clientType}`,
  });
};

  return (
    <section className="w-full pb-3">
      
        <div className="w-full mx-auto p-2 md:p-4 lg:p-8  lg:w-10/12  shadow-stripe rounded-2xl mt-10">  
        {/* 🚀 Animated heading */}
        <div className="text-start">
          <h2 
            ref={headingRef}
            className="section-heading font-poppins font-semibold text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] text-custom-blue"
          >
            Ticket Raise
          </h2>
        
          <div className="mt-0.5 flex mb-6 overflow-hidden pl-2">
            <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
              {/* GSAP-driven infinite underline */}
              <span
                ref={underlineRef}
                className="underline-glow absolute inset-0 rounded-full bg-white/70"
              />
            </span>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="space-y-10">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

    {/* ================= LEFT COLUMN ================= */}
    <div className="flex flex-col gap-8">
      <FloatingInput
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />

      <FloatingInput
        type="email"
        name="email"
        placeholder="E-mail Id"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Services */}
      <div className="w-full bg-white rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.18)]">
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full h-14 px-5 text-[16px] text-[#7B94C8] outline-none bg-transparent appearance-none"
        >
          <option value="">Services</option>
          <option value="company-registration">Company Registration</option>
          <option value="gst-filing">GST Filing</option>
          <option value="legal-support">Legal Support</option>
        </select>
      </div>
    </div>

    {/* ================= MIDDLE COLUMN ================= */}
    <div className="flex flex-col gap-12">
      <FloatingInput
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />

      {/* Client Type */}
      <div className="flex items-center gap-6 pt-4">
        <span className="text-[12px] md:text-[0.9rem] lg:text-[1.1rem] font-medium text-custom-blue font-poppins">
          Client Type
        </span>

        <span className="h-6 w-[1.5px] bg-custom-blue" />

        <label className="flex items-center gap-2 text-custom-blue text-[12px] md:text-[0.8rem] lg:text-[1rem] font-poppins">
          <input
            type="radio"
            name="clientType"
            value="previous"
            checked={formData.clientType === "previous"}
            onChange={handleChange}
            className="accent-custom-blue"
          />
          Previous
        </label>

        <label className="flex items-center gap-2 text-sm text-custom-blue text-[12px] md:text-[0.8rem] lg:text-[1rem] font-poppins">
          <input
            type="radio"
            name="clientType"
            value="new"
            checked={formData.clientType === "new"}
            onChange={handleChange}
            className="accent-custom-blue"
          />
          New Client
        </label>
      </div>
    </div>

    {/* ================= RIGHT COLUMN ================= */}
    <div className="flex flex-col gap-8">
      {/* Mobile */}
      <div className="w-full bg-white rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.18)] flex">
        <span className="flex items-center px-4 text-sm text-gray-600 border-r">
          +91
        </span>
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full h-14 px-5 text-[16px] text-gray-700 placeholder:text-[#7B94C8] bg-transparent outline-none"
        />
      </div>
    </div>

  </div>

  {/* ================= SUBMIT ================= */}
  <div className="flex justify-end pt-15">
    <button
      type="submit"
      disabled={createService.isPending}
      className="px-8 py-3 rounded-full bg-admin hover:bg-[#7B94C8] text-white text-sm font-medium transition"
    >
      {createService.isPending ? "Creating..." : "Create →"}
    </button>
  </div>

</form>

      </div>
    </section>
  );
};

export default TicketRaiseForm;
