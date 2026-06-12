"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { useMyLeaveRequests } from "../../hooks/useAttendanceMutations";

const MyLeaveRequests = () => {
  const { data, isLoading } = useMyLeaveRequests();

  const leaves = data?.leaveRequests || [];

  if (isLoading) {
    return <p className="text-gray-500">Loading leaves...</p>;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6">
      <div className="flex items-center gap-3 mb-5">
        <CalendarDays className="text-blue-600" />

        <h2 className="text-xl font-bold text-custom-blue">
          My Leave Requests
        </h2>
      </div>

      <div className="space-y-3">
        {leaves.length > 0 ? (
          leaves.map((item) => (
            <div
              key={item._id}
              className="border border-gray-100 rounded-2xl p-4 bg-blue-50/40"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-700">
                    {item.leaveType}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.startDate).toLocaleDateString()} -{" "}
                    {new Date(item.endDate).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.totalDays} Days
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 font-medium">
            No leave requests found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyLeaveRequests;