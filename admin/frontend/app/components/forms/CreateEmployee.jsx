"use client";
import { useState } from "react";
import { useRegisterEmployee } from "../../hooks/useEmployeeAuthMutations";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    panNumber: "",
    hasExistingUan: "false",
    uanNumber: "",
    hasExistingEsi: "false",
    esiNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
    salaryPerMonth: "",
    basicSalary: "",
    hra: "",
    conveyanceAllowance: "",
    medicalAllowance: "",
    specialAllowance: "",
    annualCtc: "",
    employmentType: "off-role",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const register = useRegisterEmployee();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg("");

    register.mutate(formData, {
      onSuccess: () => {
        alert("Employee created successfully");

        // reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          role: "",
          department: "",
          designation: "",
          dateOfJoining: "",
          panNumber: "",
          hasExistingUan: "false",
          uanNumber: "",
          hasExistingEsi: "false",
          esiNumber: "",
          bankAccountNumber: "",
          ifscCode: "",
          salaryPerMonth: "",
          basicSalary: "",
          hra: "",
          conveyanceAllowance: "",
          medicalAllowance: "",
          specialAllowance: "",
          annualCtc: "",
          employmentType: "off-role",
        });
      },
      onError: (err) => {
        setErrorMsg(
          err?.response?.data?.message || "Something went wrong"
        );
      },
    });
  };

  const canSubmit =
    formData.name &&
    formData.email &&
    formData.mobile &&
    formData.password &&
    formData.role &&
    (formData.hasExistingUan !== "true" || /^\d{12}$/.test(formData.uanNumber)) &&
    (formData.hasExistingEsi !== "true" || /^\d+$/.test(formData.esiNumber));

  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-full max-w-3xl rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] md:p-8">

        <h1 className="text-3xl font-bold text-custom-blue mb-2">
          New Employee
        </h1>
        <p className="mb-6 text-sm font-medium text-gray-500">
          Create a login, assign role, and set payroll basics.
        </p>

        <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="salaryPerMonth"
            placeholder="Monthly Salary"
            value={formData.salaryPerMonth}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="basicSalary"
            placeholder="Basic Salary"
            value={formData.basicSalary}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="hra"
            placeholder="HRA"
            value={formData.hra}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="conveyanceAllowance"
            placeholder="Conveyance Allowance"
            value={formData.conveyanceAllowance}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="medicalAllowance"
            placeholder="Medical Allowance"
            value={formData.medicalAllowance}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="specialAllowance"
            placeholder="Special Allowance"
            value={formData.specialAllowance}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            name="annualCtc"
            placeholder="Annual CTC"
            value={formData.annualCtc}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="off-role">Off-role Employee</option>
            <option value="on-role">On-role Employee</option>
          </select>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-700">
            {formData.employmentType === "on-role"
              ? "On-role payroll applies PF, ESI, TDS and Professional Tax. Allowances are still included."
              : "Off-role payroll uses salary and allowances only. PF, ESI, TDS and Professional Tax are not applied."}
          </div>

          <input
            type="text"
            name="panNumber"
            placeholder="PAN Number"
            value={formData.panNumber}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm font-bold text-gray-700">
              Does the employee already have a PF UAN Number from a previous company?
            </p>
            <div className="mt-3 flex gap-3">
              {["true", "false"].map((value) => (
                <label key={value} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="radio"
                    name="hasExistingUan"
                    value={value}
                    checked={formData.hasExistingUan === value}
                    onChange={handleChange}
                  />
                  {value === "true" ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </div>

          {formData.hasExistingUan === "true" && (
            <input
              type="text"
              name="uanNumber"
              placeholder="UAN Number"
              maxLength={12}
              value={formData.uanNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm font-bold text-gray-700">
              Does the employee already have an ESI Number from a previous company?
            </p>
            <div className="mt-3 flex gap-3">
              {["true", "false"].map((value) => (
                <label key={value} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="radio"
                    name="hasExistingEsi"
                    value={value}
                    checked={formData.hasExistingEsi === value}
                    onChange={handleChange}
                  />
                  {value === "true" ? "Yes" : "No"}
                </label>
              ))}
            </div>
          </div>

          {formData.hasExistingEsi === "true" && (
            <input
              type="text"
              name="esiNumber"
              placeholder="ESI Number"
              value={formData.esiNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <input
            type="text"
            name="bankAccountNumber"
            placeholder="Bank Account Number"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* <input
            type="text"
            name="role"
            placeholder="Role (admin / employee)"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          /> */}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* ERROR */}
          {errorMsg && (
            <p className="md:col-span-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || register.isPending}
            className="md:col-span-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {register.isPending ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
