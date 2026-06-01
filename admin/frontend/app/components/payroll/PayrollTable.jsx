"use client";

import React, { useState } from "react";

import {
  Download,
  Pencil,
  X,
} from "lucide-react";

import { generateSalarySlip } from "../../config/generateSalarySlip";
import {
  useLopRecoveryAction,
  usePendingLopRecoveries,
} from "../../hooks/useAttendanceMutations";

const PayrollTable = ({
  payrollData = [],
}) => {
  const [selectedPayroll, setSelectedPayroll] =
    useState(null);

  const [editData, setEditData] =
    useState({
      pf: 0,
      esi: 0,
      professionalTax: 0,
      tds: 0,
      allowances: 0,
    });

  const { data: recoveryData, refetch: refetchRecoveries } =
    usePendingLopRecoveries();
  const recoveryAction = useLopRecoveryAction();
  const recoveries = recoveryData?.recoveries || [];

  const calculateStatutoryPreview = (payroll) => {
    if (payroll?.employmentType !== "on-role") {
      return {
        pf: 0,
        esi: 0,
      };
    }

    const monthlySalary = Number(payroll?.monthlySalary || 0);
    const basicSalary =
      Number(payroll?.basicSalary || 0) ||
      (monthlySalary ? Math.round(monthlySalary * 0.48) : 0);

    return {
      pf: Math.round((basicSalary * 12) / 100),
      esi:
        monthlySalary > 0 && monthlySalary <= 21000
          ? Math.round((monthlySalary * 0.75) / 100)
          : 0,
    };
  };

  const handleRecoveryAction = (recoveryId, action) => {
    recoveryAction.mutate(
      {
        recoveryId,
        action,
        adminRemarks:
          action === "approve"
            ? "Approved for next month payroll"
            : "Rejected by admin",
      },
      {
        onSuccess: (res) => {
          alert(res.message);
          refetchRecoveries();
        },
        onError: (err) =>
          alert(err?.response?.data?.message || "Could not update request"),
      }
    );
  };

  // OPEN POPUP

  const handleOpenEdit = (
    payroll
  ) => {
    setSelectedPayroll(payroll);
    const statutoryPreview = calculateStatutoryPreview(payroll);

    setEditData({
      pf: payroll.pf || statutoryPreview.pf,
      esi: payroll.esi || statutoryPreview.esi,
      professionalTax:
        payroll.professionalTax ||
        0,
      tds: payroll.tds || 0,
      allowances:
        payroll.allowances || 0,
    });
  };

  // HANDLE CHANGE

  const handleChange = (e) => {
    setEditData({
      ...editData,

      [e.target.name]:
        e.target.value,
    });
  };

  // SAVE

  const handleSave = () => {
    console.log(
      "Updated Payroll:",
      editData
    );

    // API CALL HERE

    setSelectedPayroll(null);
  };

  return (
    <>
      <div className="bg-white rounded-[32px] border border-blue-100 shadow-[0_20px_60px_rgba(37,99,235,0.08)] overflow-hidden">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">

          <div>
            <h2 className="text-2xl font-bold text-custom-blue">
              Monthly Payroll
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Employee salary and payroll records
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white border border-blue-100 text-sm font-semibold text-blue-600 shadow-sm">
            Total Employees:
            {" "}
            {payrollData.length}
          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1650px]">

            <thead>

              <tr className="bg-blue-50 text-gray-600 text-sm">

                <th className="p-5 text-left font-bold">
                  Employee
                </th>

                <th className="p-5 text-left font-bold">
                  Employee ID
                </th>

                <th className="p-5 text-left font-bold">
                  Type
                </th>

                <th className="p-5 text-left font-bold">
                  Salary
                </th>

                <th className="p-5 text-left font-bold">
                  Present
                </th>

                <th className="p-5 text-left font-bold">
                  Half Day
                </th>

                <th className="p-5 text-left font-bold">
                  LOP
                </th>

                <th className="p-5 text-left font-bold">
                  Deduction
                </th>

                <th className="p-5 text-left font-bold">
                  Statutory
                </th>

                <th className="p-5 text-left font-bold">
                  Recovery
                </th>

                <th className="p-5 text-left font-bold">
                  Net Salary
                </th>

                <th className="p-5 text-left font-bold">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {payrollData.map(
                (item, index) => (

                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-blue-50/40 transition-all"
                  >

                    {/* EMPLOYEE */}

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                          {item.employeeName?.charAt(
                            0
                          )}
                        </div>

                        <div>

                          <p className="font-bold text-gray-800">
                            {
                              item.employeeName
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            Payroll Employee
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* EMPLOYEE ID */}

                    <td className="p-5">
                      {
                        item.employeeCode
                      }
                    </td>

                    <td className="p-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.employmentType === "on-role"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.employmentType === "on-role"
                          ? "On-role"
                          : "Off-role"}
                      </span>
                    </td>

                    {/* SALARY */}

                    <td className="p-5 font-bold text-blue-600">
                      ₹
                      {item.monthlySalary}
                    </td>

                    {/* PRESENT */}

                    <td className="p-5">
                      {
                        item.presentDays
                      }
                    </td>

                    {/* HALF DAY */}

                    <td className="p-5">
                      {item.halfDays}
                    </td>

                    {/* LOP */}

                    <td className="p-5">
                      {item.lopDays}
                    </td>

                    {/* DEDUCTION */}

                    <td className="p-5 font-bold text-red-500">
                      ₹
                      {
                        item.lopDeduction
                      }
                    </td>

                    <td className="p-5 font-bold text-red-500">
                      Rs. {item.statutoryDeduction || 0}
                    </td>

                    <td className="p-5 font-bold text-emerald-600">
                      Rs. {item.lopRecoveryAmount || 0}
                    </td>

                    {/* NET */}

                    <td className="p-5 font-bold text-emerald-600">
                      ₹
                      {
                        item.payableSalary
                      }
                    </td>

                    {/* ACTION */}

                    <td className="p-5">

                      <div className="flex items-center gap-3">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            handleOpenEdit(
                              item
                            )
                          }
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-custom-blue font-semibold shadow-lg transition-all"
                        >

                          <Pencil className="w-4 h-4" />

                          Edit

                        </button>

                        {/* SLIP */}

                        <button
                          onClick={() =>
                            generateSalarySlip(
                              item
                            )
                          }
                          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg transition-all"
                        >

                          <Download className="w-4 h-4" />

                          Slip

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

      {recoveries.length > 0 && (
        <div className="mt-6 rounded-[28px] border border-orange-100 bg-orange-50/60 p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Pending LOP Salary Recovery Requests
          </h3>

          <div className="mt-4 grid gap-3">
            {recoveries.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {item.employee_id?.name} ({item.employee_id?.employee_id})
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    Recover Rs. {item.amount} from {item.sourceMonth}/
                    {item.sourceYear} into {item.applyMonth}/{item.applyYear}
                  </p>
                  {item.reason && (
                    <p className="mt-1 text-sm text-slate-500">
                      {item.reason}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRecoveryAction(item._id, "approve")}
                    disabled={recoveryAction.isPending}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRecoveryAction(item._id, "reject")}
                    disabled={recoveryAction.isPending}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POPUP */}

      {selectedPayroll && (

        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden">

            {/* HEADER */}

            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Payroll
                </h2>

                <p className="text-gray-500 mt-1">
                  {
                    selectedPayroll.employeeName
                  }
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedPayroll(
                    null
                  )
                }
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition"
              >

                <X className="w-5 h-5 text-gray-600" />

              </button>

            </div>

            {/* BODY */}

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Provident Fund
                </label>

                <input
                  type="number"
                  name="pf"
                  value={editData.pf}
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold mb-2">
                  ESI
                </label>

                <input
                  type="number"
                  name="esi"
                  value={
                    editData.esi
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {Number(selectedPayroll.monthlySalary || 0) > 21000 && (
                  <p className="mt-2 text-xs font-semibold text-gray-500">
                    ESI applies only when gross salary is Rs. 21,000 or below.
                  </p>
                )}

              </div>

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Professional Tax
                </label>

                <input
                  type="number"
                  name="professionalTax"
                  value={
                    editData.professionalTax
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold mb-2">
                  TDS
                </label>

                <input
                  type="number"
                  name="tds"
                  value={
                    editData.tds
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="md:col-span-2">

                <label className="block text-sm font-semibold mb-2">
                  Allowances
                </label>

                <input
                  type="number"
                  name="allowances"
                  value={
                    editData.allowances
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-gray-100">

              <button
                onClick={() =>
                  setSelectedPayroll(
                    null
                  )
                }
                className="px-6 py-3 rounded-2xl border border-gray-200 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default PayrollTable;
