"use client";

import React, { useState } from "react";
import { Download, ReceiptText } from "lucide-react";
import { useMyPayroll, useRequestLopRecovery } from "../../hooks/useAttendanceMutations";
import { generateSalarySlip } from "../../config/generateSalarySlip";

export default function EmployeePayslipPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, isError, error } = useMyPayroll(month, year);
  const lopRecovery = useRequestLopRecovery();
  const payroll = data?.payroll;
  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  const handleDownload = () => {
    if (!payroll) return;
    generateSalarySlip({
      ...payroll,
      month: `${monthName} ${year}`,
    });
  };

  const handleLopRecoveryRequest = () => {
    lopRecovery.mutate(
      {
        sourceMonth: month,
        sourceYear: year,
        reason: `Request to add deducted LOP salary from ${monthName} ${year} in next month payroll`,
      },
      {
        onSuccess: (res) => alert(res.message),
        onError: (err) =>
          alert(err?.response?.data?.message || "Could not submit request"),
      }
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm">
            <ReceiptText size={16} />
            Payslip
          </span>
          <h1 className="mt-4 text-3xl font-bold text-custom-blue">
            Download Salary Slip
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Select a month and download your salary slip as PDF.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:flex-row">
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 outline-none"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(year, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 font-semibold text-gray-500">
          Loading payslip...
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 font-semibold text-red-600">
          {error?.response?.data?.message || "Could not load payslip."}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 md:grid-cols-4">
            <Info label="Employee" value={payroll?.employeeName || "-"} />
            <Info label="Code" value={payroll?.employeeCode || "-"} />
            <Info label="Designation" value={payroll?.designation || "-"} />
            <Info label="Type" value={payroll?.employmentType === "on-role" ? "On-role" : "Off-role"} />
            <Info label="Month" value={`${monthName} ${year}`} />
            <Info label="Salary" value={`Rs. ${payroll?.monthlySalary || 0}`} />
            <Info label="Allowances" value={`Rs. ${payroll?.allowances || 0}`} />
            <Info label="Statutory Deduction" value={`Rs. ${payroll?.statutoryDeduction || 0}`} />
            <Info label="Present" value={payroll?.presentDays || 0} />
            <Info label="LOP" value={payroll?.lopDays || 0} />
            <Info label="LOP Deduction" value={`Rs. ${payroll?.lopDeduction || 0}`} />
            <Info label="LOP Recovery" value={`Rs. ${payroll?.lopRecoveryAmount || 0}`} />
            <Info label="Net Pay" value={`Rs. ${payroll?.payableSalary || 0}`} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleDownload}
              disabled={!payroll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg disabled:opacity-60"
            >
              <Download size={18} />
              Download Payslip
            </button>

            {Number(payroll?.lopDeduction || 0) > 0 && (
              <button
                onClick={handleLopRecoveryRequest}
                disabled={lopRecovery.isPending}
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-orange-50 px-6 py-3 font-bold text-orange-700 disabled:opacity-60"
              >
                {lopRecovery.isPending
                  ? "Requesting..."
                  : "Request LOP Salary Next Month"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <div className="rounded-2xl bg-blue-50/60 p-4">
    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 font-bold text-gray-800">{value}</p>
  </div>
);
