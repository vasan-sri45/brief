// "use client";

// import React from "react";
// import {
//   User,
//   BriefcaseBusiness,
//   FileText,
//   Clock3,
// } from "lucide-react";

// const AttendanceSummary = ({ historyData }) => {
//   const attendance = historyData?.attendance || [];

//   const presentDays = attendance.filter(
//     (item) =>
//       item.attendanceStatus?.toLowerCase() === "present"
//   ).length;

//   const leavesTaken = attendance.filter(
//     (item) =>
//       item.attendanceStatus?.toLowerCase() === "leave"
//   ).length;

//   const lopCount = attendance.filter(
//     (item) =>
//       item.attendanceStatus?.toLowerCase() === "lop" ||
//       item.attendanceStatus?.toLowerCase() === "absent"
//   ).length;

//   const totalMinutes = attendance.reduce(
//     (total, item) => total + (item.totalMinutes || 0),
//     0
//   );

//   const totalHours = `${Math.floor(totalMinutes / 60)}h`;

//   const summaryCards = [
//     {
//       title: "Present Days",
//       value: presentDays,
//       subtitle: "This Month",
//       icon: User,
//       bg: "bg-green-50",
//       text: "text-green-600",
//       border: "border-b-green-500",
//     },
//     {
//       title: "Leaves Taken",
//       value: leavesTaken,
//       subtitle: "This Month",
//       icon: BriefcaseBusiness,
//       bg: "bg-blue-50",
//       text: "text-blue-600",
//       border: "border-b-blue-500",
//     },
//     {
//       title: "LOP Count",
//       value: lopCount,
//       subtitle: "This Month",
//       icon: FileText,
//       bg: "bg-red-50",
//       text: "text-red-500",
//       border: "border-b-red-500",
//     },
//     {
//       title: "Total Hours",
//       value: totalHours,
//       subtitle: "This Month",
//       icon: Clock3,
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//       border: "border-b-purple-500",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-8">
//       {summaryCards.map((card, index) => {
//         const Icon = card.icon;

//         return (
//           <div
//             key={index}
//             className={`
//               bg-white
//               border border-gray-100
//               ${card.border}
//               border-b-4
//               rounded-2xl
//               p-5 sm:p-6
//               shadow-[0_8px_30px_rgba(15,23,42,0.06)]
//               hover:shadow-[0_12px_40px_rgba(15,23,42,0.10)]
//               transition-all duration-300
//             `}
//           >
//             <div className="flex items-center gap-5">
//               <div
//                 className={`
//                   w-16 h-16
//                   rounded-2xl
//                   ${card.bg}
//                   flex items-center justify-center
//                   shrink-0
//                 `}
//               >
//                 <Icon size={34} className={card.text} />
//               </div>

//               <div>
//                 <h3 className="text-gray-500 font-semibold text-sm sm:text-base">
//                   {card.title}
//                 </h3>

//                 <p
//                   className={`text-3xl sm:text-4xl font-bold mt-1 ${card.text}`}
//                 >
//                   {card.value}
//                 </p>

//                 <p className="text-gray-500 font-medium text-sm mt-1">
//                   {card.subtitle}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AttendanceSummary;

"use client";

import React from "react";

import {
  User,
  BriefcaseBusiness,
  FileText,
  Clock3,
} from "lucide-react";

const AttendanceSummary = ({
  historyData,
  view = "monthly",
}) => {

  const attendance =
    historyData?.attendance || [];

  // =========================================
  // PRESENT DAYS
  // =========================================

  const presentDays =
    attendance.filter(
      (item) => {
        const status =
          item.attendanceStatus?.toLowerCase();

        return (
          status === "present" ||
          status === "late"
        );
      }
    ).length;

  // =========================================
  // LEAVES
  // =========================================

  const leavesTaken =
    attendance.filter((item) => {

      const status =
        item.attendanceStatus?.toLowerCase();

      return (
        status ===
          "sick leave" ||
        status ===
          "casual leave" ||
        status ===
          "emergency leave" ||
        status === "leave"
      );
    }).length;

  // =========================================
  // LOP
  // =========================================

  const lopCount =
    attendance.filter((item) => {

      const status =
        item.attendanceStatus?.toLowerCase();

      return (
        status === "lop" ||
        status === "absent"
      );
    }).length;

  // =========================================
  // TOTAL WORKING MINUTES
  // =========================================

  const totalMinutes =
    attendance.reduce(
      (total, item) =>
        total +
        (item.totalMinutes || 0),
      0
    );

  // =========================================
  // TOTAL HOURS FORMAT
  // =========================================

  const totalHours = `${Math.floor(
    totalMinutes / 60
  )}h ${totalMinutes % 60}m`;

  // =========================================
  // SUMMARY CARDS
  // =========================================

  const summaryCards = [
    {
      title: "Present Days",
      value: presentDays,
      subtitle: "This Month",
      icon: User,
      bg: "bg-green-50",
      text: "text-green-600",
      border:
        "border-b-green-500",
    },

    {
      title: "Leaves Taken",
      value: leavesTaken,
      subtitle: "This Month",
      icon:
        BriefcaseBusiness,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border:
        "border-b-blue-500",
    },

    {
      title: "LOP Count",
      value: lopCount,
      subtitle: "This Month",
      icon: FileText,
      bg: "bg-red-50",
      text: "text-red-500",
      border:
        "border-b-red-500",
    },

    {
      title: "Total Hours",
      value: totalHours,
      subtitle: "This Month",
      icon: Clock3,
      bg: "bg-purple-50",
      text: "text-purple-600",
      border:
        "border-b-purple-500",
    },
  ];

  const label =
    view === "daily"
      ? "Today"
      : view === "weekly"
      ? "This Week"
      : "This Month";

  const cards = summaryCards.map(
    (card) => ({
      ...card,
      subtitle: label,
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-8">

      {cards.map(
        (card, index) => {

          const Icon =
            card.icon;

          return (
            <div
              key={index}
              className={`
                bg-white
                border border-gray-100
                ${card.border}
                border-b-4
                rounded-2xl
                p-5 sm:p-6
                shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                hover:shadow-[0_12px_40px_rgba(15,23,42,0.10)]
                transition-all duration-300
              `}
            >

              <div className="flex items-center gap-5">

                {/* ICON */}
                <div
                  className={`
                    w-16 h-16
                    rounded-2xl
                    ${card.bg}
                    flex items-center justify-center
                    shrink-0
                  `}
                >
                  <Icon
                    size={34}
                    className={
                      card.text
                    }
                  />
                </div>

                {/* CONTENT */}
                <div>

                  <h3 className="text-gray-500 font-semibold text-sm sm:text-base">
                    {card.title}
                  </h3>

                  <p
                    className={`
                      text-3xl sm:text-4xl
                      font-bold mt-1
                      ${card.text}
                    `}
                  >
                    {card.value}
                  </p>

                  <p className="text-gray-500 font-medium text-sm mt-1">
                    {card.subtitle}
                  </p>

                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default AttendanceSummary;
