// "use client";

// import React, { useMemo, useState } from "react";
// import { Clock3, Filter, CalendarDays } from "lucide-react";

// const AttendanceHistoryTable = ({ historyData }) => {
//   const [filter, setFilter] = useState("all");
//   const [monthFilter, setMonthFilter] = useState("all");

//   const attendance = historyData?.attendance || [];

//   const monthOptions = Array.from(
//   { length: 12 },
//   (_, index) => {
//     const date = new Date(
//       new Date().getFullYear(),
//       index,
//       1
//     );

//     const value = `${date.getFullYear()}-${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}`;

//     const label = date.toLocaleDateString("en-US", {
//       month: "long",
//       year: "numeric",
//     });

//     return { value, label };
//   }
// );

//   const filteredAttendance = attendance.filter((item) => {
//     const statusMatch =
//       filter === "all" ||
//       item.attendanceStatus?.toLowerCase() === filter;

//     const monthMatch =
//       monthFilter === "all" ||
//       item.dayKey?.slice(0, 7) === monthFilter;

//     return statusMatch && monthMatch;
//   });

//   return (
//     <div className="xl:col-span-2 bg-white rounded-3xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] border border-gray-100 p-4 sm:p-6 overflow-hidden">

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
//             <Clock3 size={22} className="text-blue-600" />
//           </div>

//           <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
//             Attendance History
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">

//           {/* MONTH FILTER */}
//           <div className="relative w-full">
//             <CalendarDays
//               size={17}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//             />

//             <select
//               value={monthFilter}
//               onChange={(e) => setMonthFilter(e.target.value)}
//               className="w-full sm:w-[180px] appearance-none bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-600 outline-none"
//             >
//               <option value="all">All Months</option>

//               {monthOptions.map((month) => (
//                 <option
//                   key={month.value}
//                   value={month.value}
//                 >
//                   {month.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* STATUS FILTER */}
//           <div className="relative w-full">
//             <Filter
//               size={17}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//             />

//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full sm:w-[180px] appearance-none bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-600 outline-none"
//             >
//               <option value="all">All Records</option>
//               <option value="present">Present</option>
//               <option value="absent">Absent</option>
//               <option value="leave">Leave</option>
//             </select>
//           </div>

//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[720px] border-collapse">

//           <thead>
//             <tr className="bg-blue-50 text-gray-600">
//               <th className="p-4 text-left text-sm font-bold rounded-l-xl">
//                 Date
//               </th>
//               <th className="p-4 text-left text-sm font-bold">
//                 Status
//               </th>
//               <th className="p-4 text-left text-sm font-bold">
//                 Punch In
//               </th>
//               <th className="p-4 text-left text-sm font-bold">
//                 Punch Out
//               </th>
//               <th className="p-4 text-left text-sm font-bold rounded-r-xl">
//                 Hours
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredAttendance.length > 0 ? (
//               filteredAttendance.map((item) => (
//                 <tr
//                   key={item._id}
//                   className="border-b border-gray-100 hover:bg-gray-50 transition"
//                 >
//                   <td className="p-4 text-sm font-medium text-gray-600">
//                     <div className="flex items-center gap-4">
//                       <span className="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
//                       {item.dayKey}
//                     </div>
//                   </td>

//                   <td className="p-4">
//                     <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
//                       {item.attendanceStatus}
//                     </span>
//                   </td>

//                   <td className="p-4 text-sm font-medium text-gray-600">
//                     {item.punchInTime
//                       ? new Date(item.punchInTime).toLocaleTimeString()
//                       : "--"}
//                   </td>

//                   <td className="p-4 text-sm font-medium text-gray-600">
//                     {item.punchOutTime
//                       ? new Date(item.punchOutTime).toLocaleTimeString()
//                       : "--"}
//                   </td>

//                   <td className="p-4 text-sm font-medium text-gray-600">
//                     {item.workingHours}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="p-8 text-center text-gray-500 font-medium"
//                 >
//                   No attendance records found
//                 </td>
//               </tr>
//             )}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default AttendanceHistoryTable;


"use client";

import React, { useState } from "react";
import {
  Clock3,
  Filter,
  CalendarDays,
} from "lucide-react";

const AttendanceHistoryTable = ({
  historyData,
  isLoading,
  setShowCorrectionModal,
  setSelectedAttendance,
}) => {
  const [filter, setFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const attendance = historyData?.attendance || [];

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), index, 1);

    const value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    const label = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { value, label };
  });

  const filteredAttendance = attendance.filter((item) => {
    const statusMatch =
      filter === "all" ||
      item.attendanceStatus?.toLowerCase() === filter;

    const monthMatch =
      monthFilter === "all" ||
      item.dayKey?.slice(0, 7) === monthFilter;

    return statusMatch && monthMatch;
  });

  const handleCorrectionClick = (item) => {
    setSelectedAttendance(item);
    setShowCorrectionModal(true);
  };

  return (
    <div className="flex h-[560px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.08)] sm:p-6 xl:col-span-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Clock3 size={22} className="text-blue-600" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
            Attendance History
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="relative w-full">
            <CalendarDays
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full sm:w-[180px] appearance-none bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-600 outline-none"
            >
              <option value="all">All Months</option>

              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full">
            <Filter
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-[180px] appearance-none bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-gray-600 outline-none"
            >
              <option value="all">All Records</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half-day">Half-Day</option>
              <option value="absent">Absent</option>
              <option value="lop">LOP</option>
              <option value="pending correction">
                Pending Correction
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 bg-blue-50 text-gray-600">
              <th className="p-4 text-left text-sm font-bold rounded-l-xl">
                Date
              </th>

              <th className="p-4 text-left text-sm font-bold">
                Status
              </th>

              <th className="p-4 text-left text-sm font-bold">
                Punch In
              </th>

              <th className="p-4 text-left text-sm font-bold">
                Punch Out
              </th>

              <th className="p-4 text-left text-sm font-bold">
                Hours
              </th>

              <th className="p-4 text-left text-sm font-bold">
                Correction
              </th>

              <th className="p-4 text-left text-sm font-bold rounded-r-xl">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-8 text-center text-gray-500 font-medium"
                >
                  Loading attendance records...
                </td>
              </tr>
            ) : filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => {
                const isApprovedLeave = [
                  "Sick Leave",
                  "Casual Leave",
                  "Emergency Leave",
                ].includes(item.attendanceStatus);
                const canRequestCorrection =
                  !isApprovedLeave &&
                  (!item.punchInTime ||
                    !item.punchOutTime ||
                    item.attendanceStatus === "LOP" ||
                    item.attendanceStatus === "Absent");

                return (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            item.attendanceStatus === "Present"
                              ? "bg-green-500"
                              : item.attendanceStatus === "Late"
                              ? "bg-orange-500"
                              : item.attendanceStatus === "Half-Day"
                              ? "bg-yellow-500"
                              : item.attendanceStatus ===
                                "Pending Correction"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        ></span>

                        {item.dayKey}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          item.attendanceStatus === "Present"
                            ? "bg-green-100 text-green-700"
                            : item.attendanceStatus === "Late"
                            ? "bg-orange-100 text-orange-700"
                            : item.attendanceStatus === "Half-Day"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.attendanceStatus ===
                              "Pending Correction"
                            ? "bg-orange-100 text-orange-700"
                            : item.attendanceStatus === "LOP"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.attendanceStatus}
                      </span>
                    </td>

                    <td className="p-4 text-sm font-medium text-gray-600">
                      {item.punchInTime
                        ? new Date(item.punchInTime).toLocaleTimeString()
                        : "--"}
                    </td>

                    <td className="p-4 text-sm font-medium text-gray-600">
                      {item.punchOutTime
                        ? new Date(item.punchOutTime).toLocaleTimeString()
                        : "--"}
                    </td>

                    <td className="p-4 text-sm font-medium text-gray-600">
                      {item.workingHours || "0h 0m"}
                    </td>

                    <td className="p-4 text-sm font-semibold text-slate-500">
                      {item.adminApproved
                        ? "Admin Approved"
                        : item.attendanceStatus === "Pending Correction"
                        ? "Pending"
                        : "-"}
                    </td>

                    <td className="p-4">
                      {canRequestCorrection ? (
                        <button
                          onClick={() => handleCorrectionClick(item)}
                          className="whitespace-nowrap rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          Correct
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No Action
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-8 text-center text-gray-500 font-medium"
                >
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistoryTable;
