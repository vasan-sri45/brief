"use client";

import React from "react";
import { FileText } from "lucide-react";

import {
  useAdminPendingLeaves,
  useAdminLeaveAction,
} from "../../hooks/useAttendanceMutations";

const AttendanceQuickReport = ({
  todayAttendanceData,
  refetch,
}) => {
  const attendance =
    todayAttendanceData?.attendance || [];

  const {
    data: pendingLeaveData,
    refetch: refetchLeaves,
  } = useAdminPendingLeaves();

  const leaveAction = useAdminLeaveAction();

  const pendingLeaves =
    pendingLeaveData?.leaveRequests || [];

  const handleApprove = (item) => {
    leaveAction.mutate(
      {
        leaveRequestId: item._id,
        action: "approve",
        adminRemarks: "Approved by Admin",
      },
      {
        onSuccess: () => {
          refetch?.();
          refetchLeaves?.();
        },
      }
    );
  };

  const handleReject = (item) => {
    leaveAction.mutate(
      {
        leaveRequestId: item._id,
        action: "reject",
        adminRemarks: "Rejected by Admin",
      },
      {
        onSuccess: () => {
          refetch?.();
          refetchLeaves?.();
        },
      }
    );
  };

  const lateEmployees =
    todayAttendanceData?.lateToday ??
    attendance.filter(
      (item) => item.attendanceStatus === "Late"
    ).length;

  const halfDayCount =
    todayAttendanceData?.halfDay ??
    attendance.filter(
      (item) => item.attendanceStatus === "Half-Day"
    ).length;

  const lopCount =
    todayAttendanceData?.lopToday ??
    attendance.filter(
      (item) => item.attendanceStatus === "LOP"
    ).length;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6 h-[350px] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
          <FileText className="text-blue-600" />
        </div>

        <h2 className="text-xl font-bold text-custom-blue">
          Quick Report
        </h2>
      </div>

      <div className="space-y-4">
        <Report label="Late Employees" value={lateEmployees} color="text-orange-500" bg="bg-orange-50" />

        <Report label="Half Day" value={halfDayCount} color="text-yellow-500" bg="bg-yellow-50" />

        <Report label="LOP Count" value={lopCount} color="text-red-500" bg="bg-red-50" />

        <Report label="Pending Leave Requests" value={pendingLeaves.length} color="text-purple-600" bg="bg-purple-50" />

        {pendingLeaves.map((item) => (
          <div
            key={item._id}
            className="bg-purple-50 rounded-2xl p-4 border border-purple-100"
          >
            <p className="font-bold text-gray-700">
              {item.employee_id?.name || "Employee"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {item.leaveType} • {item.totalDays} days
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.startDate).toLocaleDateString()} -{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleApprove(item)}
                disabled={leaveAction.isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(item)}
                disabled={leaveAction.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Report = ({ label, value, color, bg }) => (
  <div
    className={`flex items-center justify-between rounded-2xl px-4 py-4 ${bg}`}
  >
    <span className="font-semibold text-gray-700">
      {label}
    </span>

    <span className={`font-bold text-lg ${color}`}>
      {value}
    </span>
  </div>
);

export default AttendanceQuickReport;
