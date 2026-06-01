// "use client";

// import React, {
//   useState,
//   useEffect,
// } from "react";

// import Link from "next/link";

// import {
//   useTodayAttendance,
// } from "../../hooks/useAttendanceMutations";

// import ProfileImage from "./ProfileImage";

// const WelcomeCard = ({
//   name,
//   code,
// }) => {

//   // ======================================
//   // API
//   // ======================================

//   const {
//     data,
//   } = useTodayAttendance();

//   // ======================================
//   // ATTENDANCE DATA
//   // ======================================

//   const attendance =
//     data?.attendance;

//   // ======================================
//   // DATE
//   // ======================================

//   const [currentDate, setCurrentDate] =
//     useState("");

//   useEffect(() => {

//     const today =
//       new Date().toDateString();

//     setCurrentDate(today);

//   }, []);

//   // ======================================
//   // STATUS COLOR
//   // ======================================

//   const getStatusColor = (
//     status
//   ) => {

//     switch (status) {

//       case "Present":
//         return "text-green-600";

//       case "Sick Leave":
//         return "text-blue-500";

//       case "Casual Leave":
//         return "text-purple-500";

//       case "Emergency Leave":
//         return "text-orange-500";

//       case "LOP":
//         return "text-red-500";

//       case "Half-Day":
//         return "text-yellow-500";

//       default:
//         return "text-gray-500";
//     }
//   };

//   return (
//     <div className="w-full mx-auto mt-10 lg:w-10/12">

//       {/* CARD */}
//       <div className="bg-white rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.18)] p-6 lg:p-8">

//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

//           {/* LEFT SECTION */}
//           <div className="flex items-center gap-6">

//             {/* PROFILE */}
//             <div className="flex flex-col items-center">

//               <ProfileImage />

//               <p className="font-bold text-custom-blue mt-2 text-lg">
//                 {name}
//               </p>

//               <p className="text-sm text-custom-blue">
//                 {code}
//               </p>
//             </div>

//             {/* DIVIDER */}
//             <div className="hidden md:block w-[2px] h-24 bg-custom-blue rounded-full" />

//             {/* CONTENT */}
//             <div>

//               <h2 className="text-2xl md:text-3xl font-bold text-custom-blue">
//                 Great to see you here!
//               </h2>

//               <p className="text-lightYelow mt-2 text-base">
//                 Let’s make today productive and meaningful.
//               </p>

//               {/* DATE */}
//               <p className="text-sm text-gray-500 mt-3">
//                 {currentDate}
//               </p>

//               {/* STATUS */}
//               <div className="mt-3">

//                 <p className="text-sm font-semibold text-gray-600">

//                   Status :

//                   <span
//                     className={`ml-2 font-bold ${getStatusColor(
//                       attendance?.attendanceStatus
//                     )}`}
//                   >
//                     {attendance?.attendanceStatus ||
//                       "Not Marked"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="flex justify-end">

//             <Link
//               href="/employee/attendance"
//               className="px-6 py-3 rounded-xl bg-custom-blue hover:bg-blue-700 text-white font-semibold transition duration-300 shadow-md hover:shadow-lg"
//             >
//               Open Attendance
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeCard;


"use client";

import React, {
  useState,
  useEffect,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  useTodayAttendance,
} from "../../hooks/useAttendanceMutations";

import ProfileImage from "./ProfileImage";

const WelcomeCard = ({ name, code }) => {
  const { data } = useTodayAttendance();

  const attendance = data?.attendance;

  const [currentDate, setCurrentDate] =
    useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    setCurrentDate(today);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";

      case "Sick Leave":
        return "bg-blue-100 text-blue-700";

      case "Casual Leave":
        return "bg-purple-100 text-purple-700";

      case "Emergency Leave":
        return "bg-orange-100 text-orange-700";

      case "LOP":
        return "bg-red-100 text-red-700";

      case "Half-Day":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="w-full mx-auto mt-6 sm:mt-10 lg:w-11/12 px-3 sm:px-0">

      <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50 to-white rounded-3xl border border-blue-100 shadow-[0_12px_40px_rgba(37,99,235,0.10)] p-5 sm:p-6 lg:p-8">

        <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-70" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-70" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">

          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            {/* PROFILE */}
            <div className="flex sm:flex-col items-center gap-4 sm:gap-0 shrink-0">

              <ProfileImage />

              <div className="sm:text-center">
                <p className="font-bold text-[#0F172A] mt-0 sm:mt-3 text-lg">
                  {name}
                </p>

                <p className="text-sm font-medium text-blue-600">
                  {code}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="hidden sm:block w-px h-28 bg-blue-200 rounded-full" />

            {/* CONTENT */}
            <div className="min-w-0">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold mb-3">
                <CheckCircle2 size={16} />
                Employee Dashboard
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] leading-tight">
                Great to see you here!
              </h2>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Let’s make today productive and meaningful.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mt-4">

                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />
                  {currentDate}
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  Status:
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                      attendance?.attendanceStatus
                    )}`}
                  >
                    {attendance?.attendanceStatus ||
                      "Not Marked"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex xl:justify-end">

            <Link
              href="/employee/attendance"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.03] text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-200"
            >
              Open Attendance
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;