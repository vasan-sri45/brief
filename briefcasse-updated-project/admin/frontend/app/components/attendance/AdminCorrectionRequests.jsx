"use client";

import React from "react";
import {
  useAdminAttendanceCorrections,
  useAdminCorrectionAction,
} from "../../hooks/useAttendanceCorrectionMutations";

const AdminCorrectionRequests = ({
  refetchAttendance,
}) => {
  const { data, isLoading, refetch } =
    useAdminAttendanceCorrections();

  const { mutate, isPending } =
    useAdminCorrectionAction();

  const handleAction = (correctionId, action) => {
    mutate(
      {
        correctionId,
        action,
        adminRemarks:
          action === "approve"
            ? "Approved by admin"
            : "Rejected by admin",
      },
      {
        onSuccess: (data) => {
          alert(data.message);
          refetch();
          refetchAttendance?.();
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-3xl border p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-5">
        Attendance Correction Requests
      </h2>

      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-4 text-left">Employee</th>
            <th className="p-4 text-left">Code</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Punch In</th>
            <th className="p-4 text-left">Punch Out</th>
            <th className="p-4 text-left">Reason</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.corrections?.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-4 font-semibold">
                {item.employee_id?.name}
              </td>

              <td className="p-4">
                {item.employee_id?.employee_id}
              </td>

              <td className="p-4">
                {item.correctionType}
              </td>

              <td className="p-4">
                {item.requestedPunchInTime
                  ? new Date(
                      item.requestedPunchInTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="p-4">
                {item.requestedPunchOutTime
                  ? new Date(
                      item.requestedPunchOutTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="p-4">
                {item.reason}
              </td>

              <td className="p-4 flex gap-2">
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleAction(item._id, "approve")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Approve
                </button>

                <button
                  disabled={isPending}
                  onClick={() =>
                    handleAction(item._id, "reject")
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}

          {data?.corrections?.length === 0 && (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500">
                No pending correction requests
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCorrectionRequests;
