// "use client";
// import React from "react";
// import {
//   CalendarDays,
//   Clock3,
// } from "lucide-react";

// const AttendanceHeader = ({
//   attendance,
//   workingHours,
// }) => {
//   return (
//     <div className="w-full p-5">

//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

//         {/* LEFT SECTION */}
//         <div className="flex items-start gap-5 flex-1">

//           {/* ICON */}
//           <div className="min-w-[70px] h-[70px] rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
//             <CalendarDays
//               size={32}
//               className="text-white"
//             />
//           </div>

//           {/* CONTENT */}
//           <div className="w-full">

//             <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-5">
//               Today's Attendance
//             </h2>

//             <div className="flex flex-wrap items-center gap-x-8 gap-y-4">

//               {/* STATUS */}
//               <div className="flex items-center gap-3">

//                 <span className="w-3 h-3 rounded-full bg-green-500"></span>

//                 <span className="text-gray-500 font-medium">
//                   Status:
//                 </span>

//                 <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-sm">
//                   {attendance?.attendanceStatus ||
//                     "Not Marked"}
//                 </span>
//               </div>

//               {/* PUNCH IN */}
//               <div className="flex items-center gap-3 border-l border-gray-200 pl-6">

//                 <Clock3
//                   size={18}
//                   className="text-gray-400"
//                 />

//                 <span className="text-gray-500 font-medium">
//                   Punch In:
//                 </span>

//                 <span className="text-[#334155] font-semibold">
//                   {attendance?.punchInTime
//                     ? new Date(
//                         attendance.punchInTime
//                       ).toLocaleTimeString()
//                     : "--"}
//                 </span>
//               </div>

//               {/* PUNCH OUT */}
//               <div className="flex items-center gap-3 border-l border-gray-200 pl-6">

//                 <Clock3
//                   size={18}
//                   className="text-gray-400"
//                 />

//                 <span className="text-gray-500 font-medium">
//                   Punch Out:
//                 </span>

//                 <span className="text-[#334155] font-semibold">
//                   {attendance?.punchOutTime
//                     ? new Date(
//                         attendance.punchOutTime
//                       ).toLocaleTimeString()
//                     : "--"}
//                 </span>
//               </div>

//               {/* WORKING HOURS */}
//               <div className="flex items-center gap-3 border-l border-gray-200 pl-6">

//                 <span className="text-gray-500 font-medium">
//                   Working Hours:
//                 </span>

//                 <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-sm">
//                   {workingHours}
//                 </span>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceHeader;


"use client";

import React from "react";
import {
  CalendarDays,
  Clock3,
} from "lucide-react";

const AttendanceHeader = ({
  attendance,
  workingHours,
}) => {
  return (
    <div className="w-full px-4 py-5 sm:p-5">

      <div className="flex flex-col gap-5">

        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">

          {/* ICON */}
          <div className="w-14 h-14 sm:w-[70px] sm:h-[70px] rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <CalendarDays
              size={28}
              className="text-white sm:w-8 sm:h-8"
            />
          </div>

          {/* CONTENT */}
          <div className="w-full min-w-0">

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] mb-4 sm:mb-5">
              Today&apos;s Attendance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center gap-3 xl:gap-x-8 xl:gap-y-4">

              {/* STATUS */}
              <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3 xl:bg-transparent xl:p-0">

                <span className="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>

                <span className="text-gray-500 font-medium text-sm sm:text-base">
                  Status:
                </span>

                <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-xs sm:text-sm">
                  {attendance?.attendanceStatus ||
                    "Not Marked"}
                </span>
              </div>

              {/* PUNCH IN */}
              <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3 xl:bg-transparent xl:p-0 xl:border-l xl:border-gray-200 xl:pl-6">

                <Clock3
                  size={18}
                  className="text-gray-400 shrink-0"
                />

                <span className="text-gray-500 font-medium text-sm sm:text-base">
                  Punch In:
                </span>

                <span className="text-[#334155] font-semibold text-sm sm:text-base">
                  {attendance?.punchInTime
                    ? new Date(
                        attendance.punchInTime
                      ).toLocaleTimeString()
                    : "--"}
                </span>
              </div>

              {/* PUNCH OUT */}
              <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3 xl:bg-transparent xl:p-0 xl:border-l xl:border-gray-200 xl:pl-6">

                <Clock3
                  size={18}
                  className="text-gray-400 shrink-0"
                />

                <span className="text-gray-500 font-medium text-sm sm:text-base">
                  Punch Out:
                </span>

                <span className="text-[#334155] font-semibold text-sm sm:text-base">
                  {attendance?.punchOutTime
                    ? new Date(
                        attendance.punchOutTime
                      ).toLocaleTimeString()
                    : "--"}
                </span>
              </div>

              {/* WORKING HOURS */}
              <div className="flex items-center gap-3 bg-white/70 rounded-xl p-3 xl:bg-transparent xl:p-0 xl:border-l xl:border-gray-200 xl:pl-6">

                <span className="text-gray-500 font-medium text-sm sm:text-base">
                  Working Hours:
                </span>

                <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-xs sm:text-sm">
                  {workingHours}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
