// "use client";

// import React, { useState } from "react";
// import FloatingInput from "./FloatingInput";
// import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
// import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";
// import { useCreatePaidService } from "../../hooks/useService";
// import { useAllServices } from "../../hooks/userServiceList";

// const TicketRaiseForm = () => {

//   const { data ,isLoading, isError} = useAllServices();

//   const createService = useCreatePaidService();
//   const headingRef = useGsapSectionHeading(0.2);
//   const underlineRef = useGsapUnderlineLoop();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     mobile: "",
//     email: "",
//     serviceTitle: "",
//     service:"",
//     clientType: "previous",
//   });

//   const uniqueServices = data?.items
//   ? Array.from(
//       new Map(
//         data.items.map((item) => [item.title, item])
//       ).values()
//     )
//   : [];

//   const filteredServices = data?.items?.filter(
//   (item) => item.title === formData.serviceTitle
// );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   const handleSubmit = (e) => {
//   e.preventDefault();

//   createService.mutate({
//     customerName: `${formData.firstName} ${formData.lastName}`,
//     customerMobile: formData.mobile,
//     customerEmail: formData.email,
//     serviceType: "Paid Service",
//     serviceTitle: formData.serviceTitle,
//     service: formData.service,
//     paymentMode: "Cash",
//     totalPayment: 0,
//     notes: `Client Type: ${formData.clientType}`,
//   });
// };

//   return (
//     <section className="w-full pb-3">
      
//         <div className="w-full mx-auto p-2 md:p-4 lg:p-8  lg:w-10/12  shadow-stripe rounded-2xl mt-10">  
//         {/* 🚀 Animated heading */}
//         <div className="text-start">
//           <h2 
//             ref={headingRef}
//             className="section-heading font-poppins font-semibold text-[1.1rem] md:text-[1.3rem] lg:text-[1.6rem] text-custom-blue"
//           >
//             Ticket Raise
//           </h2>
        
//           <div className="mt-0.5 flex mb-6 overflow-hidden pl-2">
//             <span className="relative h-[3px] w-16 rounded-full bg-custom-blue">
//               {/* GSAP-driven infinite underline */}
//               <span
//                 ref={underlineRef}
//                 className="underline-glow absolute inset-0 rounded-full bg-white/70"
//               />
//             </span>
//           </div>
//         </div>

//       <form onSubmit={handleSubmit} className="space-y-10">

//   <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

//     {/* ================= LEFT COLUMN ================= */}
//     <div className="flex flex-col gap-8">
//       <FloatingInput
//         name="firstName"
//         placeholder="First Name"
//         value={formData.firstName}
//         onChange={handleChange}
//       />

//       <FloatingInput
//         type="email"
//         name="email"
//         placeholder="E-mail Id"
//         value={formData.email}
//         onChange={handleChange}
//       />

//       {/* Services */}
//       <div className="w-full bg-white rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.18)]">
//         <select
//           name="serviceTitle"
//           value={formData.serviceTitle}
//           onChange={handleChange}
//           className="w-full h-14 px-5 text-[16px] text-[#7B94C8] outline-none bg-transparent appearance-none"
//         >
//           <option value="">Services</option>

//           {uniqueServices.map((service) => (
//             <option key={service._id} value={service.title}>
//               {service.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="w-full bg-white rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.18)]">
//         <select
//           name="service"
//           value={formData.service}
//           onChange={handleChange}
//           className="w-full h-14 px-5 text-[16px] text-[#7B94C8] outline-none bg-transparent appearance-none"
//         >
//           <option value="">Services</option>

//           {filteredServices?.map((service) => (
//             <option key={service._id} value={service._id}>
//               {service.heading}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>

    

//     {/* ================= MIDDLE COLUMN ================= */}
//     <div className="flex flex-col gap-12">
//       <FloatingInput
//         name="lastName"
//         placeholder="Last Name"
//         value={formData.lastName}
//         onChange={handleChange}
//       />

//       {/* Client Type */}
//       <div className="flex items-center gap-6 pt-4">
//         <span className="text-[12px] md:text-[0.9rem] lg:text-[1.1rem] font-medium text-custom-blue font-poppins">
//           Client Type
//         </span>

//         <span className="h-6 w-[1.5px] bg-custom-blue" />

//         <label className="flex items-center gap-2 text-custom-blue text-[12px] md:text-[0.8rem] lg:text-[1rem] font-poppins">
//           <input
//             type="radio"
//             name="clientType"
//             value="previous"
//             checked={formData.clientType === "previous"}
//             onChange={handleChange}
//             className="accent-custom-blue"
//           />
//           Previous
//         </label>

//         <label className="flex items-center gap-2 text-sm text-custom-blue text-[12px] md:text-[0.8rem] lg:text-[1rem] font-poppins">
//           <input
//             type="radio"
//             name="clientType"
//             value="new"
//             checked={formData.clientType === "new"}
//             onChange={handleChange}
//             className="accent-custom-blue"
//           />
//           New Client
//         </label>
//       </div>
//     </div>

//     {/* ================= RIGHT COLUMN ================= */}
//     <div className="flex flex-col gap-8">
//       {/* Mobile */}
//       <div className="w-full bg-white rounded-md shadow-[0_6px_12px_rgba(0,0,0,0.18)] flex">
//         <span className="flex items-center px-4 text-sm text-gray-600 border-r">
//           +91
//         </span>
//         <input
//           type="tel"
//           name="mobile"
//           placeholder="Mobile Number"
//           value={formData.mobile}
//           onChange={handleChange}
//           className="w-full h-14 px-5 text-[16px] text-gray-700 placeholder:text-[#7B94C8] bg-transparent outline-none"
//         />
//       </div>
//     </div>

//   </div>

//   {/* ================= SUBMIT ================= */}
//   <div className="flex justify-end pt-15">
//     <button
//       type="submit"
//       disabled={createService.isPending}
//       className="px-8 py-3 rounded-full bg-admin hover:bg-[#7B94C8] text-white text-sm font-medium transition"
//     >
//       {createService.isPending ? "Creating..." : "Create →"}
//     </button>
//   </div>

// </form>

//       </div>
//     </section>
//   );
// };

// export default TicketRaiseForm;


"use client";

import React, { useState } from "react";

import {
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

import FloatingInput from "./FloatingInput";

import { useGsapSectionHeading } from "../../hooks/animation/useGsapSectionHeading";
import { useGsapUnderlineLoop } from "../../hooks/animation/useGsapUnderlineLoop";

import { useCreatePaidService } from "../../hooks/useService";
import { useAllServices } from "../../hooks/userServiceList";
import { api } from "../../api/api";

const TicketRaiseForm = () => {

  const {
    data,
  } = useAllServices();

  const createService =
    useCreatePaidService();

  const headingRef =
    useGsapSectionHeading(0.2);

  const underlineRef =
    useGsapUnderlineLoop();

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      serviceTitle: "",
      service: "",
      clientType: "new",
      customerUserId: "",
    });
  const [lookupState, setLookupState] =
    useState({
      loading: false,
      message: "",
      error: "",
      services: [],
    });
  const [createdCustomerId, setCreatedCustomerId] =
    useState("");
  const [submitMessage, setSubmitMessage] =
    useState({ type: "", text: "" });

  // =========================================
  // UNIQUE SERVICES
  // =========================================

  const uniqueServices =
    data?.items
      ? Array.from(
          new Map(
            data.items.map(
              (item) => [
                item.title,
                item,
              ]
            )
          ).values()
        )
      : [];

  // =========================================
  // FILTERED SERVICES
  // =========================================

  const filteredServices =
    data?.items?.filter(
      (item) =>
        item.title ===
        formData.serviceTitle
    );

  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "serviceTitle" ? { service: "" } : {}),
    }));

    if (name === "clientType") {
      setLookupState({
        loading: false,
        message: "",
        error: "",
        services: [],
      });
      setCreatedCustomerId("");
    }

    setSubmitMessage({ type: "", text: "" });
  };

  const handleCustomerLookup = async () => {
    const customerUserId =
      formData.customerUserId.trim();

    if (!customerUserId) {
      setLookupState({
        loading: false,
        message: "",
        error: "Enter a customer ID first.",
        services: [],
      });
      return;
    }

    setLookupState({
      loading: true,
      message: "",
      error: "",
      services: [],
    });

    try {
      const res = await api.get(
        `/paid/customer/${encodeURIComponent(customerUserId)}`
      );
      const customer =
        res.data?.data?.customer || {};
      const services =
        res.data?.data?.services || [];

      setFormData((prev) => ({
        ...prev,
        firstName:
          customer.firstName || prev.firstName,
        lastName:
          customer.lastName || prev.lastName,
        mobile:
          customer.mobile || prev.mobile,
        email:
          customer.email || prev.email,
        customerUserId:
          res.data?.data?.userCode ||
          customerUserId.toUpperCase(),
      }));

      setLookupState({
        loading: false,
        message:
          services.length > 0
            ? `Customer found. ${services.length} previous service${services.length === 1 ? "" : "s"} linked.`
            : "Customer found. No previous services linked yet.",
        error: "",
        services,
      });
    } catch (error) {
      setLookupState({
        loading: false,
        message: "",
        error:
          error.response?.data?.message ||
          "Customer ID not found.",
        services: [],
      });
    }
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (e) => {

    e.preventDefault();
    setCreatedCustomerId("");
    setSubmitMessage({ type: "", text: "" });

    if (
      !formData.firstName.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.serviceTitle ||
      !formData.service
    ) {
      setSubmitMessage({
        type: "error",
        text: "Please fill customer details and select a service.",
      });
      return;
    }

    if (
      formData.clientType === "previous" &&
      !formData.customerUserId.trim()
    ) {
      setSubmitMessage({
        type: "error",
        text: "Enter the Customer ID for previous client or choose New Client.",
      });
      return;
    }

    const selectedService = data?.items?.find(
      (item) => item._id === formData.service
    );

    createService.mutate({
      customerName: `${formData.firstName} ${formData.lastName}`,

      customerMobile:
        formData.mobile,

      customerEmail:
        formData.email,
      customerUserId:
        formData.customerUserId,
      clientType:
        formData.clientType,

      serviceType:
        "Paid Service",

      serviceTitle:
        formData.serviceTitle,

      service:
        formData.service,
      serviceName:
        selectedService?.heading ||
        selectedService?.title ||
        "",

      paymentMode: "Cash",

      totalPayment: 0,

      notes: `Client Type: ${formData.clientType}`,
    }, {
      onSuccess: (res) => {
        const userCode =
          res?.data?.customer?.userCode;
        if (userCode) {
          setCreatedCustomerId(userCode);
        }
        setSubmitMessage({
          type: "success",
          text: `Ticket created successfully${userCode ? ` for ${userCode}` : ""}.`,
        });
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          serviceTitle: "",
          service: "",
          clientType: "new",
          customerUserId: "",
        });
        setLookupState({
          loading: false,
          message: "",
          error: "",
          services: [],
        });
      },
      onError: (error) => {
        setSubmitMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Ticket could not be created. Please check the form and try again.",
        });
      },
    });
  };

  return (
    <section className="w-full pb-10 px-3 sm:px-5">

      <div className="relative overflow-hidden w-full mx-auto lg:w-10/12 bg-gradient-to-br from-white via-blue-50/40 to-white rounded-[32px] border border-blue-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-5 sm:p-7 lg:p-10">

        {/* BG BLUR */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-100 rounded-full blur-3xl opacity-70" />

        <div className="relative z-10">

          {/* HEADER */}
          <div className="mb-10">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              <CheckCircle2 size={16} />
              Customer Service Ticket
            </div>

            <h2
              ref={headingRef}
              className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A]"
            >
              Raise a Ticket
            </h2>

            <div className="mt-3 flex overflow-hidden">
              <span className="relative h-[4px] w-24 rounded-full bg-blue-600">
                <span
                  ref={underlineRef}
                  className="absolute inset-0 rounded-full bg-white/70"
                />
              </span>
            </div>

            <p className="text-gray-500 mt-4 max-w-2xl text-sm sm:text-base leading-relaxed">
              Submit customer service requests and assign services efficiently with a clean and organized workflow.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-10">

              {/* LEFT */}
              <div className="space-y-7">

                <InputWrapper
                  icon={<User size={18} />}
                >
                  <FloatingInput
                    name="firstName"
                    placeholder="First Name"
                    value={
                      formData.firstName
                    }
                    onChange={
                      handleChange
                    }
                  />
                </InputWrapper>

                <InputWrapper
                  icon={<Mail size={18} />}
                >
                  <FloatingInput
                    type="email"
                    name="email"
                    placeholder="E-mail Address"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                  />
                </InputWrapper>

                {/* SERVICE TITLE */}
                <SelectWrapper
                  icon={
                    <BriefcaseBusiness
                      size={18}
                    />
                  }
                >
                  <select
                    name="serviceTitle"
                    value={
                      formData.serviceTitle
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-14 px-5 bg-transparent outline-none text-gray-700 appearance-none"
                  >
                    <option value="">
                      Select Service Category
                    </option>

                    {uniqueServices.map(
                      (service) => (
                        <option
                          key={
                            service._id
                          }
                          value={
                            service.title
                          }
                        >
                          {
                            service.title
                          }
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </SelectWrapper>

                {/* SERVICE */}
                <SelectWrapper
                  icon={
                    <BriefcaseBusiness
                      size={18}
                    />
                  }
                >
                  <select
                    name="service"
                    value={
                      formData.service
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-14 px-5 bg-transparent outline-none text-gray-700 appearance-none"
                  >
                    <option value="">
                      Select Service
                    </option>

                    {filteredServices?.map(
                      (service) => (
                        <option
                          key={
                            service._id
                          }
                          value={
                            service._id
                          }
                        >
                          {
                            service.heading
                          }
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </SelectWrapper>

              </div>

              {/* MIDDLE */}
              <div className="space-y-7">

                <InputWrapper
                  icon={<User size={18} />}
                >
                  <FloatingInput
                    name="lastName"
                    placeholder="Last Name"
                    value={
                      formData.lastName
                    }
                    onChange={
                      handleChange
                    }
                  />
                </InputWrapper>

                {/* CLIENT TYPE */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.05)] p-5">

                  <p className="text-sm font-semibold text-[#0F172A] mb-4">
                    Client Type
                  </p>

                  <div className="flex flex-wrap gap-4">

                    <label
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer ${
                        formData.clientType === "previous"
                          ? "border-blue-100 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="clientType"
                        value="previous"
                        checked={
                          formData.clientType ===
                          "previous"
                        }
                        onChange={
                          handleChange
                        }
                        className="accent-blue-600"
                      />

                      <span className="font-medium text-blue-700">
                        Previous
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer ${
                        formData.clientType === "new"
                          ? "border-blue-100 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="clientType"
                        value="new"
                        checked={
                          formData.clientType ===
                          "new"
                        }
                        onChange={
                          handleChange
                        }
                        className="accent-blue-600"
                      />

                      <span className="font-medium text-gray-700">
                        New Client
                      </span>
                    </label>

                  </div>
                </div>

                {formData.clientType === "previous" && (
                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <label className="text-sm font-semibold text-slate-700">
                      Customer ID
                    </label>

                    <div className="mt-2 flex flex-col gap-3 min-[900px]:flex-row">
                      <input
                        name="customerUserId"
                        value={formData.customerUserId}
                        onChange={handleChange}
                        placeholder="Example: CUS00001"
                        className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        onClick={handleCustomerLookup}
                        disabled={lookupState.loading}
                        className="h-12 w-full shrink-0 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60 min-[900px]:w-auto"
                      >
                        {lookupState.loading ? "Checking..." : "Find"}
                      </button>
                    </div>

                    {lookupState.message && (
                      <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                        {lookupState.message}
                      </p>
                    )}

                    {lookupState.error && (
                      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                        {lookupState.error}
                      </p>
                    )}

                    {lookupState.services.length > 0 && (
                      <div className="mt-3 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Latest Service
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {lookupState.services[0]?.service?.heading ||
                            lookupState.services[0]?.service?.title ||
                            lookupState.services[0]?.serviceType}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {createdCustomerId && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    Ticket created. Customer ID: {createdCustomerId}
                  </div>
                )}

                {submitMessage.text && (
                  <div
                    className={`rounded-2xl border p-4 text-sm font-semibold ${
                      submitMessage.type === "success"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="space-y-7">

                {/* MOBILE */}
                <div className="relative bg-white border border-gray-100 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.05)] overflow-hidden">

                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>

                  <div className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    +91
                  </div>

                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full h-14
                      pl-24 pr-5
                      bg-transparent
                      outline-none
                      text-gray-700
                      placeholder:text-gray-400
                    "
                  />
                </div>

                {/* INFO CARD */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-[0_20px_50px_rgba(37,99,235,0.25)]">

                  <h3 className="text-xl font-bold">
                    Quick Support
                  </h3>

                  <p className="text-blue-100 mt-2 text-sm leading-relaxed">
                    Raise service tickets quickly and track progress with real-time updates.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                    <p className="text-sm font-medium">
                      Support Team Active
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* SUBMIT */}
            <div className="flex justify-end pt-2">

              <button
                type="submit"
                disabled={
                  createService.isPending
                }
                className="
                  inline-flex items-center gap-3
                  px-8 py-4
                  rounded-2xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:scale-[1.03]
                  text-white
                  font-semibold
                  shadow-lg shadow-blue-200
                  transition-all duration-300
                  disabled:opacity-70
                "
              >
                {createService.isPending
                  ? "Creating Ticket..."
                  : "Create Ticket →"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TicketRaiseForm;

/* =========================================
   INPUT WRAPPER
========================================= */

const InputWrapper = ({
  icon,
  children,
}) => (
  <div className="relative bg-white border border-gray-100 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.05)] overflow-hidden">

    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
      {icon}
    </div>

    <div className="pl-12">
      {children}
    </div>

  </div>
);

/* =========================================
   SELECT WRAPPER
========================================= */

const SelectWrapper = ({
  icon,
  children,
}) => (
  <div className="relative bg-white border border-gray-100 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.05)] overflow-hidden">

    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
      {icon}
    </div>

    <div className="pl-12">
      {children}
    </div>

  </div>
);
