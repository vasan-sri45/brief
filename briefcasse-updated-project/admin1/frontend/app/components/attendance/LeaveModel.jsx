"use client";

import React, {
  useState,
} from "react";

const LeaveModal = ({
  showLeaveModal,
  setShowLeaveModal,
  handleLeaveRequest,
}) => {

  const [leaveType, setLeaveType] =
    useState("Sick Leave");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [leaveRemarks, setLeaveRemarks] =
    useState("");

  const [error, setError] =
    useState("");

  if (!showLeaveModal)
    return null;

  const submitLeaveRequest = () => {

    if (!startDate || !endDate) {
      setError("Please select both start and end date.");

      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");

      return;
    }

    setError("");

    handleLeaveRequest({
      leaveType,

      startDate,

      endDate,

      remarks: leaveRemarks,
    });

    setLeaveRemarks("");
    setStartDate("");
    setEndDate("");
    setLeaveType("Sick Leave");

    setShowLeaveModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-custom-blue mb-6">
          Request Leave
        </h2>

        {/* LEAVE TYPE */}
        <div className="mb-4">

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Leave Type
          </label>

          <select
            value={leaveType}
            onChange={(e) =>
              setLeaveType(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
          >

            <option>
              Sick Leave
            </option>

            <option>
              Casual Leave
            </option>

            <option>
              Emergency Leave
            </option>

          </select>
        </div>

        {/* START DATE */}
        <div className="mb-4">

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

        </div>

        {/* END DATE */}
        <div className="mb-4">

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

        </div>

        {/* REMARKS */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Remarks
          </label>

          <textarea
            value={leaveRemarks}
            onChange={(e) =>
              setLeaveRemarks(
                e.target.value
              )
            }
            placeholder="Enter remarks..."
            rows={4}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3">

          <button
            onClick={
              submitLeaveRequest
            }
            className="flex-1 bg-custom-blue hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Submit
          </button>

          <button
            onClick={() =>
              setShowLeaveModal(false)
            }
            className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition font-semibold"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
