// // "use client";

// // import React from "react";

// // import {
// //   Users,
// //   UserCheck,
// //   UserX,
// //   CalendarDays,
// // } from "lucide-react";

// // import AttendanceStatsCards from "./AttendanceStatsCard";
// // import TodayAttendanceTable from "./TodayAttendanceTable";
// // import AttendanceQuickReport from "./AttendanceQuickReport";

// // import { useAdminTodayAttendance } from "../../hooks/useAttendanceMutations";

// // import { exportAttendanceExcel } from "../../config/exportAttendanceExcel";

// // const AdminAttendanceDashboard = () => {

// //   const {
// //     data,
// //     isLoading,
// //     isError,
// //     refetch,
// //   } = useAdminTodayAttendance();

// //   const attendance =
// //     data?.attendance || [];

// //   const totalEmployees =
// //     data?.totalEmployees || 0;

// //   // ======================================
// //   // PRESENT TODAY
// //   // ======================================

// //   const presentToday =
// //     attendance.filter(
// //       (item) =>
// //         item.attendanceStatus?.toLowerCase() ===
// //         "present"
// //     ).length;

// //   // ======================================
// //   // ABSENT TODAY
// //   // ======================================

// //   const absentToday =
// //     totalEmployees - attendance.length;

// //   // ======================================
// //   // ON LEAVE
// //   // ======================================

// //   const onLeave =
// //     attendance.filter((item) => {

// //       const status =
// //         item.attendanceStatus?.toLowerCase();

// //       return (
// //         status === "sick leave" ||
// //         status === "casual leave" ||
// //         status === "emergency leave"
// //       );
// //     }).length;

// //   // ======================================
// //   // STATS CARDS
// //   // ======================================

// //   const cards = [
// //     {
// //       title: "Total Employees",
// //       value: totalEmployees,
// //       icon: Users,
// //       bg: "bg-blue-50",
// //       text: "text-blue-600",
// //       border: "border-b-blue-500",
// //     },

// //     {
// //       title: "Present Today",
// //       value: presentToday,
// //       icon: UserCheck,
// //       bg: "bg-green-50",
// //       text: "text-green-600",
// //       border: "border-b-green-500",
// //     },

// //     {
// //       title: "Absent Today",
// //       value: absentToday,
// //       icon: UserX,
// //       bg: "bg-red-50",
// //       text: "text-red-500",
// //       border: "border-b-red-500",
// //     },

// //     {
// //       title: "On Leave",
// //       value: onLeave,
// //       icon: CalendarDays,
// //       bg: "bg-purple-50",
// //       text: "text-purple-600",
// //       border: "border-b-purple-500",
// //     },
// //   ];

// //   // ======================================
// //   // LOADING
// //   // ======================================

// //   if (isLoading) {
// //     return (
// //       <div className="p-6 text-gray-500 font-semibold">
// //         Loading attendance dashboard...
// //       </div>
// //     );
// //   }

// //   // ======================================
// //   // ERROR
// //   // ======================================

// //   if (isError) {
// //     return (
// //       <div className="p-6 text-red-500 font-semibold">
// //         Failed to load attendance dashboard
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-5">

// //       {/* HEADER */}
// //       <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

// //         <div>

// //           <h1 className="text-2xl md:text-3xl font-bold text-custom-blue">
// //             Attendance Dashboard
// //           </h1>

// //           <p className="text-gray-500 mt-1">
// //             Monitor employee attendance,
// //             working hours, and leave records.
// //           </p>

// //         </div>

// //         {/* EXPORT BUTTON */}
// //         <button
// //           onClick={() =>
// //             exportAttendanceExcel(
// //               attendance
// //             )
// //           }
// //           className="
// //             px-5 py-3
// //             rounded-2xl
// //             bg-green-600
// //             hover:bg-green-700
// //             text-white
// //             font-semibold
// //             shadow-lg
// //             transition-all duration-300
// //           "
// //         >
// //           Export Excel
// //         </button>

// //       </div>

// //       {/* STATS */}
// //       <AttendanceStatsCards
// //         cards={cards}
// //       />

// //       {/* TABLE + QUICK REPORT */}
// //       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

// //         <TodayAttendanceTable
// //           attendanceData={
// //             attendance
// //           }
// //         />

// //         <AttendanceQuickReport
// //           todayAttendanceData={
// //             data
// //           }
// //           refetch={refetch}
// //         />

// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminAttendanceDashboard;


// "use client";

// import React, { useState } from "react";

// import {
//   Users,
//   UserCheck,
//   UserX,
//   CalendarDays,
// } from "lucide-react";

// import AttendanceStatsCards from "./AttendanceStatsCard";
// import TodayAttendanceTable from "./TodayAttendanceTable";
// import AttendanceQuickReport from "./AttendanceQuickReport";

// import {
//   useAdminTodayAttendance,
//   useAttendanceByDateRange,
// } from "../../hooks/useAttendanceMutations";

// import { exportAttendanceExcel } from "../../config/exportAttendanceExcel";

// const AdminAttendanceDashboard = () => {
//   const [startDate, setStartDate] =
//     useState("");

//   const [endDate, setEndDate] =
//     useState("");

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//   } = useAdminTodayAttendance();

//   const {
//     data: rangeData,
//   } = useAttendanceByDateRange(
//     startDate,
//     endDate
//   );

//   const attendance =
//     data?.attendance || [];

//   const filteredAttendance =
//     rangeData?.attendance ||
//     attendance;

//   const totalEmployees =
//     data?.totalEmployees || 0;

//   const presentToday =
//     attendance.filter(
//       (item) =>
//         item.attendanceStatus?.toLowerCase() ===
//         "present"
//     ).length;

//   const absentToday =
//     totalEmployees - attendance.length;

//   const onLeave =
//     attendance.filter((item) => {
//       const status =
//         item.attendanceStatus?.toLowerCase();

//       return (
//         status === "sick leave" ||
//         status === "casual leave" ||
//         status === "emergency leave"
//       );
//     }).length;

//   const cards = [
//     {
//       title: "Total Employees",
//       value: totalEmployees,
//       icon: Users,
//       bg: "bg-blue-50",
//       text: "text-blue-600",
//       border: "border-b-blue-500",
//     },
//     {
//       title: "Present Today",
//       value: presentToday,
//       icon: UserCheck,
//       bg: "bg-green-50",
//       text: "text-green-600",
//       border: "border-b-green-500",
//     },
//     {
//       title: "Absent Today",
//       value: absentToday,
//       icon: UserX,
//       bg: "bg-red-50",
//       text: "text-red-500",
//       border: "border-b-red-500",
//     },
//     {
//       title: "On Leave",
//       value: onLeave,
//       icon: CalendarDays,
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//       border: "border-b-purple-500",
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="p-6 text-gray-500 font-semibold">
//         Loading attendance dashboard...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6 text-red-500 font-semibold">
//         Failed to load attendance dashboard
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-5">

//       <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-custom-blue">
//             Attendance Dashboard
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Monitor employee attendance, working hours, and leave records.
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">

//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) =>
//               setStartDate(e.target.value)
//             }
//             className="px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
//           />

//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) =>
//               setEndDate(e.target.value)
//             }
//             className="px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
//           />

//           <button
//             onClick={() => {
//               setStartDate("");
//               setEndDate("");
//             }}
//             className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300"
//           >
//             Clear
//           </button>

//           <button
//             onClick={() =>
//               exportAttendanceExcel(
//                 filteredAttendance
//               )
//             }
//             className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-300"
//           >
//             Export Excel
//           </button>

//         </div>
//       </div>

//       <AttendanceStatsCards
//         cards={cards}
//       />

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

//         <TodayAttendanceTable
//           attendanceData={
//             filteredAttendance
//           }
//         />

//         <AttendanceQuickReport
//           todayAttendanceData={data}
//           refetch={refetch}
//         />

//       </div>
//     </div>
//   );
// };

// export default AdminAttendanceDashboard;


"use client";

import React, { useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  ClockAlert,
} from "lucide-react";

import AttendanceStatsCards from "./AttendanceStatsCard";
import TodayAttendanceTable from "./TodayAttendanceTable";
import AttendanceQuickReport from "./AttendanceQuickReport";
import AdminCorrectionRequests from "./AdminCorrectionRequests";

import {
  useAdminTodayAttendance,
  useAttendanceByDateRange,
} from "../../hooks/useAttendanceMutations";

import { exportAttendanceExcel } from "../../config/exportAttendanceExcel";

const AdminAttendanceDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, isError, refetch } =
    useAdminTodayAttendance();

  const { data: rangeData } = useAttendanceByDateRange(
    startDate,
    endDate
  );

  const attendance = data?.attendance || [];
  const filteredAttendance = rangeData?.attendance || attendance;

  const totalEmployees = data?.totalEmployees || 0;
  const presentToday = data?.presentToday || 0;
  const absentToday = data?.absentToday || 0;
  const lateToday = data?.lateToday || 0;

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-b-blue-500",
    },
    {
      title: "Present Today",
      value: presentToday,
      icon: UserCheck,
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-b-green-500",
    },
    {
      title: "Absent Today",
      value: absentToday,
      icon: UserX,
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-b-red-500",
    },
    {
      title: "Late Today",
      value: lateToday,
      icon: ClockAlert,
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-b-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500 font-semibold">
        Loading attendance dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Failed to load attendance dashboard
      </div>
    );
  }

  return (
    <div className="p-4 md:p-5">
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-custom-blue">
            Attendance Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor employee attendance, working hours, and leave records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-300"
          >
            Clear
          </button>

          <button
            onClick={() => exportAttendanceExcel(filteredAttendance)}
            className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition-all duration-300"
          >
            Export Excel
          </button>
        </div>
      </div>

      <AttendanceStatsCards cards={cards} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TodayAttendanceTable attendanceData={filteredAttendance} />

        <AttendanceQuickReport
          todayAttendanceData={data}
          refetch={refetch}
        />
      </div>

      <div className="mt-6">
        <AdminCorrectionRequests refetchAttendance={refetch} />
      </div>
    </div>
  );
};

export default AdminAttendanceDashboard;
