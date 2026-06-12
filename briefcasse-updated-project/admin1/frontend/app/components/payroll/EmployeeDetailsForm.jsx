"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useMyPersonalDetails,
  useUpdatePersonalDetails,
} from "../../hooks/usePersonalMutations";

const todayInput = new Date().toISOString().slice(0, 10);

const toInputDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};

const isValidPastDate = (value) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && value <= todayInput;
};

const EmployeeDetailsForm = () => {
  const [formData, setFormData] =
    useState({
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      address: "",
      location: "",
      panNo: "",
      accountNo: "",
      ifscNo: "",
      bankName: "",
      branchName: "",
    });
  const [errorMsg, setErrorMsg] = useState("");

  // =========================
  // QUERIES & MUTATIONS
  // =========================

  const { data, isLoading } =
    useMyPersonalDetails();

  const {
    mutate: updatePersonalDetails,
    isPending,
  } = useUpdatePersonalDetails();

  // =========================
  // EMPLOYEE DETAILS
  // =========================

  const employeeName =
    data?.personalDetails
      ?.employeeName || "";

  const employeeCode =
    data?.personalDetails
      ?.employeeCode || "";

  // =========================
  // SET FORM DATA
  // =========================

  useEffect(() => {
    if (data?.personalDetails) {
      setFormData({
        fatherName:
          data.personalDetails
            .fatherName || "",

        motherName:
          data.personalDetails
            .motherName || "",

        dateOfBirth: toInputDate(
          data.personalDetails
            .dateOfBirth
        ),

        address:
          data.personalDetails
            .address || "",

        location:
          data.personalDetails
            .location || "",

        panNo:
          data.personalDetails
            .panNo || "",

        accountNo:
          data.personalDetails
            .accountNo || "",

        ifscNo:
          data.personalDetails
            .ifscNo || "",

        bankName:
          data.personalDetails
            .bankName || "",

        branchName:
          data.personalDetails
            .branchName || "",
      });
    }
  }, [data]);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isValidPastDate(formData.dateOfBirth)) {
      setErrorMsg("Please select a valid date of birth.");
      return;
    }

    updatePersonalDetails(
      formData,
      {
        onSuccess: (data) => {
          alert(data.message);
        },

        onError: (error) => {
          setErrorMsg(
            error?.response?.data?.message || "Something went wrong"
          );
        },
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="h-[500px] sm:h-[600px] flex items-center justify-center text-blue-600 font-semibold text-lg">
        Loading...
      </div>
    );
  }

  // =========================
  // STYLES
  // =========================

  const inputClass =
    "w-full bg-white border border-blue-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition text-sm sm:text-base";

  const labelClass =
    "block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2";

  return (
    <section className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-[#F8FBFF]">

      <div className="max-w-7xl h-[600px] overflow-y-auto mx-auto rounded-2xl sm:rounded-[32px] border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-4 sm:p-6 md:p-10 shadow-[0_20px_60px_rgba(37,99,235,0.10)]">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8 mb-6 sm:mb-10">

          {/* LEFT SIDE */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

            {/* PROFILE */}

            <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 sm:min-w-[120px]">

              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border border-blue-200 flex items-center justify-center shadow-lg">

                <span className="text-2xl sm:text-4xl font-bold text-white uppercase">
                  {employeeName?.charAt(0) || "P"}
                </span>

              </div>

              <div className="text-center sm:mt-3">

                <p className="font-bold text-base sm:text-xl text-[#020617] capitalize">
                  {employeeName ||
                    "Employee"}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-semibold">
                  {employeeCode || ""}
                </p>

              </div>

            </div>

            {/* DIVIDER */}

            <div className="hidden md:block h-28 w-px bg-blue-200" />

            {/* CONTENT */}

            <div>

              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-100 bg-white text-blue-600 text-xs sm:text-sm font-semibold shadow-sm">
                Employee Profile
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#020617] mt-3 sm:mt-5 leading-tight">
                Update your profile information
              </h2>

              <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg">
                Fill your personal and bank details for payroll and payslip.
              </p>

            </div>
          </div>

          {/* DESKTOP BUTTON */}

          <div className="hidden lg:block">

            <button
              type="submit"
              form="personal-details-form"
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {isPending
                ? "Saving..."
                : "Save Details →"}
            </button>

          </div>

        </div>

        {/* FORM */}

        <form
          id="personal-details-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >

          {/* FATHER NAME */}

          <div>
            <label className={labelClass}>
              Father Name
            </label>

            <input
              type="text"
              name="fatherName"
              value={
                formData.fatherName
              }
              onChange={
                handleChange
              }
              placeholder="Enter father name"
              className={inputClass}
            />
          </div>

          {/* MOTHER NAME */}

          <div>
            <label className={labelClass}>
              Mother Name
            </label>

            <input
              type="text"
              name="motherName"
              value={
                formData.motherName
              }
              onChange={
                handleChange
              }
              placeholder="Enter mother name"
              className={inputClass}
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className={labelClass}>
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={
                formData.dateOfBirth
              }
              max={todayInput}
              onChange={
                handleChange
              }
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              placeholder="Enter address"
              className={inputClass}
            />
          </div>

          {/* LOCATION */}

          <div>
            <label className={labelClass}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={
                formData.location
              }
              onChange={
                handleChange
              }
              placeholder="Enter location"
              className={inputClass}
            />
          </div>

          {/* PAN */}

          <div>
            <label className={labelClass}>
              PAN Number
            </label>

            <input
              type="text"
              name="panNo"
              value={
                formData.panNo
              }
              onChange={
                handleChange
              }
              placeholder="ABCDE1234F"
              className={`${inputClass} uppercase`}
            />
          </div>

          {/* ACCOUNT */}

          <div>
            <label className={labelClass}>
              Account Number
            </label>

            <input
              type="text"
              name="accountNo"
              value={
                formData.accountNo
              }
              onChange={
                handleChange
              }
              placeholder="Enter account number"
              className={inputClass}
            />
          </div>

          {/* IFSC */}

          <div>
            <label className={labelClass}>
              IFSC Code
            </label>

            <input
              type="text"
              name="ifscNo"
              value={
                formData.ifscNo
              }
              onChange={
                handleChange
              }
              placeholder="SBIN0001234"
              className={`${inputClass} uppercase`}
            />
          </div>

          {/* BANK NAME */}

          <div>
            <label className={labelClass}>
              Bank Name
            </label>

            <input
              type="text"
              name="bankName"
              value={
                formData.bankName
              }
              onChange={
                handleChange
              }
              placeholder="Enter bank name"
              className={inputClass}
            />
          </div>

          {/* BRANCH NAME */}

          <div>
            <label className={labelClass}>
              Branch Name
            </label>

            <input
              type="text"
              name="branchName"
              value={
                formData.branchName
              }
              onChange={
                handleChange
              }
              placeholder="Enter branch name"
              className={inputClass}
            />
          </div>

          {/* MOBILE BUTTON */}

          {errorMsg && (
            <p className="md:col-span-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMsg}
            </p>
          )}

          <div className="lg:hidden">

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              {isPending
                ? "Saving..."
                : "Save Details →"}
            </button>

          </div>

        </form>
      </div>
    </section>
  );
};

export default EmployeeDetailsForm;

