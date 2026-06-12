// "use client";

// import React from "react";
// import { Clock3 } from "lucide-react";

// const TodayAttendanceTable = ({
//   attendanceData = [],
// }) => {
//   const calculateHours = (inTime, outTime) => {
//     if (!inTime) return "0h 0m";

//     const start = new Date(inTime);
//     const end = outTime ? new Date(outTime) : new Date();

//     const totalMinutes = Math.floor(
//       (end - start) / (1000 * 60)
//     );

//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;

//     return `${hours}h ${minutes}m`;
//   };

//   return (
//     <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6 overflow-x-auto">
//       <div className="flex items-center gap-3 mb-6">
//         <Clock3 className="text-blue-600" />

//         <h2 className="text-xl font-bold text-custom-blue">
//           Today Attendance
//         </h2>
//       </div>

//       <table className="w-full min-w-[800px]">
//         <thead>
//           <tr className="bg-blue-50 text-gray-600">
//             <th className="p-4 text-left rounded-l-xl">Employee</th>
//             <th className="p-4 text-left">Code</th>
//             <th className="p-4 text-left">Status</th>
//             <th className="p-4 text-left">Punch In</th>
//             <th className="p-4 text-left">Punch Out</th>
//             <th className="p-4 text-left rounded-r-xl">Hours</th>
//           </tr>
//         </thead>

//         <tbody>
//           {attendanceData.length > 0 ? (
//             attendanceData.map((item) => (
//               <tr
//                 key={item._id}
//                 className="border-b border-gray-100"
//               >
//                 <td className="p-4 font-semibold text-gray-700">
//                   {item.employee_id?.name || "Employee"}
//                 </td>

//                 <td className="p-4 text-gray-500">
//                   {item.employee_id?.employee_id || "--"}
//                 </td>

//                 <td className="p-4">
//                   <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
//                     {item.attendanceStatus || "Not Marked"}
//                   </span>
//                 </td>

//                 <td className="p-4 text-gray-500">
//                   {item.punchInTime
//                     ? new Date(item.punchInTime).toLocaleTimeString()
//                     : "--"}
//                 </td>

//                 <td className="p-4 text-gray-500">
//                   {item.punchOutTime
//                     ? new Date(item.punchOutTime).toLocaleTimeString()
//                     : "--"}
//                 </td>

//                 <td className="p-4 text-gray-500">
//                   {item.workingHours ||
//                     calculateHours(
//                       item.punchInTime,
//                       item.punchOutTime
//                     )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan="6"
//                 className="p-8 text-center text-gray-500 font-medium"
//               >
//                 No attendance records found today
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TodayAttendanceTable;

"use client";

import React from "react";
import { Clock3 } from "lucide-react";

const TodayAttendanceTable = ({
  attendanceData = [],
}) => {
  const calculateHours = (inTime, outTime) => {
    if (!inTime) return "0h 0m";

    const start = new Date(inTime);
    const end = outTime
      ? new Date(outTime)
      : new Date();

    const totalMinutes = Math.floor(
      (end - start) / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getExtraInfo = (item) => {
    const punchIn = item.punchInTime
      ? new Date(item.punchInTime)
      : null;

    const punchOut = item.punchOutTime
      ? new Date(item.punchOutTime)
      : null;

    const isLate =
      punchIn &&
      (punchIn.getHours() > 10 ||
        (punchIn.getHours() === 10 &&
          punchIn.getMinutes() > 0));

    const isEarlyOut =
      punchOut && punchOut.getHours() < 18;

    const totalMinutes =
      item.totalMinutes || 0;

    const overtimeMinutes =
      totalMinutes > 480
        ? totalMinutes - 480
        : 0;

    const overtimeHours = `${Math.floor(
      overtimeMinutes / 60
    )}h ${overtimeMinutes % 60}m`;

    return {
      isLate,
      isEarlyOut,
      overtimeMinutes,
      overtimeHours,
    };
  };

  const getStatusClass = (status) => {
    if (status === "Present") return "bg-green-100 text-green-700";
    if (status === "Late") return "bg-orange-100 text-orange-700";
    if (status === "Half-Day") return "bg-yellow-100 text-yellow-700";
    if (status === "Absent" || status === "LOP") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6 overflow-x-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock3 className="text-blue-600" />

        <h2 className="text-xl font-bold text-custom-blue">
          Today Attendance
        </h2>
      </div>

      <table className="w-full min-w-[1150px]">
        <thead>
          <tr className="bg-blue-50 text-gray-600">
            <th className="p-4 text-left rounded-l-xl">
              Employee
            </th>

            <th className="p-4 text-left">
              Code
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Punch In
            </th>

            <th className="p-4 text-left">
              Punch Out
            </th>

            <th className="p-4 text-left">
              Hours
            </th>

            <th className="p-4 text-left">
              Late
            </th>

            <th className="p-4 text-left">
              Early Out
            </th>

            <th className="p-4 text-left rounded-r-xl">
              Overtime
            </th>
          </tr>
        </thead>

        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((item) => {
              const {
                isLate,
                isEarlyOut,
                overtimeMinutes,
                overtimeHours,
              } = getExtraInfo(item);

              return (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-700">
                    {item.employee_id?.name || "Employee"}
                  </td>

                  <td className="p-4 text-gray-500">
                    {item.employee_id?.employee_id || "--"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusClass(
                        item.attendanceStatus
                      )}`}
                    >
                      {item.attendanceStatus || "Not Marked"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {item.punchInTime
                      ? new Date(
                          item.punchInTime
                        ).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="p-4 text-gray-500">
                    {item.punchOutTime
                      ? new Date(
                          item.punchOutTime
                        ).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="p-4 text-gray-500 font-medium">
                    {item.workingHours ||
                      calculateHours(
                        item.punchInTime,
                        item.punchOutTime
                      )}
                  </td>

                  <td className="p-4">
                    {isLate ? (
                      <span className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs font-bold">
                        Late
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-xs font-bold">
                        On Time
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {isEarlyOut ? (
                      <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold">
                        Early
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-xs font-bold">
                        Normal
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-blue-600 font-bold">
                    {overtimeMinutes > 0
                      ? overtimeHours
                      : "--"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="9"
                className="p-8 text-center text-gray-500 font-medium"
              >
                No attendance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAttendanceTable;
