// "use client";
// import React from "react";
// import {
//   CalendarDays,
//   LogIn,
//   LogOut,
// } from "lucide-react";

// const AttendanceActions = ({
//   handlePunch,
//   setShowLeaveModal,
//   isPunchedIn,
//   punchIn,
//   punchOut,
// }) => {
//   return (
//     <div className="flex flex-wrap items-center gap-4">

//       {/* PUNCH BUTTON */}
//       <button
//         onClick={handlePunch}
//         disabled={
//           punchIn.isPending ||
//           punchOut.isPending
//         }
//         className={`
//           flex items-center gap-2
//           px-7 py-3.5
//           rounded-2xl
//           text-white
//           font-semibold
//           shadow-lg
//           transition-all duration-300

//           ${
//             isPunchedIn
//               ? "bg-gradient-to-r from-red-500 to-rose-500 hover:scale-[1.03] hover:shadow-red-200"
//               : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.03] hover:shadow-blue-200"
//           }

//           disabled:opacity-70
//           disabled:cursor-not-allowed
//           disabled:hover:scale-100
//         `}
//       >

//         {isPunchedIn ? (
//           <LogOut size={20} />
//         ) : (
//           <LogIn size={20} />
//         )}

//         <span>
//           {punchIn.isPending ||
//           punchOut.isPending
//             ? "Processing..."
//             : isPunchedIn
//             ? "Punch Out"
//             : "Punch In"}
//         </span>
//       </button>

//       {/* REQUEST LEAVE */}
//       <button
//         onClick={() =>
//           setShowLeaveModal(true)
//         }
//         disabled={isPunchedIn}
//         className={`
//           flex items-center gap-2
//           px-7 py-3.5
//           rounded-2xl
//           font-semibold
//           border
//           transition-all duration-300

//           ${
//             isPunchedIn
//               ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//               : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:scale-[1.03] shadow-sm"
//           }
//         `}
//       >

//         <CalendarDays size={20} />

//         <span>
//           Request Leave
//         </span>
//       </button>
//     </div>
//   );
// };

// export default AttendanceActions;


"use client";

import React from "react";
import {
  CalendarDays,
  LogIn,
  LogOut,
} from "lucide-react";

const AttendanceActions = ({
  handlePunch,
  setShowLeaveModal,
  isPunchedIn,
  punchIn,
  punchOut,
}) => {
  const isLoading =
    punchIn.isPending || punchOut.isPending;

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">

      {/* PUNCH BUTTON */}
      <button
        onClick={handlePunch}
        disabled={isLoading}
        className={`
          w-full sm:w-auto
          flex items-center justify-center gap-2
          px-5 sm:px-7
          py-3 sm:py-3.5
          rounded-xl sm:rounded-2xl
          text-white
          text-sm sm:text-base
          font-semibold
          shadow-lg
          transition-all duration-300

          ${
            isPunchedIn
              ? "bg-gradient-to-r from-red-500 to-rose-500 hover:scale-[1.03] hover:shadow-red-200"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.03] hover:shadow-blue-200"
          }

          disabled:opacity-70
          disabled:cursor-not-allowed
          disabled:hover:scale-100
        `}
      >
        {isPunchedIn ? (
          <LogOut size={18} />
        ) : (
          <LogIn size={18} />
        )}

        <span>
          {isLoading
            ? "Processing..."
            : isPunchedIn
            ? "Punch Out"
            : "Punch In"}
        </span>
      </button>

      {/* REQUEST LEAVE */}
      <button
        onClick={() => setShowLeaveModal(true)}
        disabled={isPunchedIn}
        className={`
          w-full sm:w-auto
          flex items-center justify-center gap-2
          px-5 sm:px-7
          py-3 sm:py-3.5
          rounded-xl sm:rounded-2xl
          text-sm sm:text-base
          font-semibold
          border
          transition-all duration-300

          ${
            isPunchedIn
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:scale-[1.03] shadow-sm"
          }
        `}
      >
        <CalendarDays size={18} />

        <span>
          Request Leave
        </span>
      </button>
    </div>
  );
};

export default AttendanceActions;