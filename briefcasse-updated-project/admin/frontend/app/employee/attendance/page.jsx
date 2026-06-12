

// "use client";

// import React, { useState } from "react";

// import {
//   usePunchIn,
//   usePunchOut,
//   useTodayAttendance,
//   useAttendanceHistory,
//   useRequestLeave,
// } from "../../hooks/useAttendanceMutations";

// import AttendanceCalendar from "../../components/attendance/AttendanceCalander";
// import AttendanceHeader from "../../components/attendance/AttendanceHeader";
// import AttendanceActions from "../../components/attendance/AttendanceActions";
// import AttendanceSummary from "../../components/attendance/AttendanceSummary";
// import AttendanceHistoryTable from "../../components/attendance/AttendanceHistoryTable";
// import LeaveModal from "../../components/attendance/LeaveModel";
// import MyLeaveRequests from "../../components/attendance/MyLeaveRequests";

// const AttendancePage = () => {
//   const [showLeaveModal, setShowLeaveModal] = useState(false);

//   const { data, refetch } = useTodayAttendance();
//   const { data: historyData } = useAttendanceHistory();

//   const punchIn = usePunchIn();
//   const punchOut = usePunchOut();
//   const requestLeave = useRequestLeave();

//   const attendance = data?.attendance;

//   const isPunchedIn =
//     attendance?.punchInTime && !attendance?.punchOutTime;

//   const calculateHours = (inTime, outTime) => {
//     if (!inTime) return "0h 0m";

//     const start = new Date(inTime);
//     const end = outTime ? new Date(outTime) : new Date();

//     const totalMinutes = Math.floor(
//       (end - start) / (1000 * 60)
//     );

//     return `${Math.floor(totalMinutes / 60)}h ${
//       totalMinutes % 60
//     }m`;
//   };

//   const workingHours = calculateHours(
//     attendance?.punchInTime,
//     attendance?.punchOutTime
//   );

//   const handlePunch = () => {
//     if (isPunchedIn) {
//       punchOut.mutate(null, {
//         onSuccess: () => refetch(),
//       });
//     } else {
//       punchIn.mutate(null, {
//         onSuccess: () => refetch(),
//       });
//     }
//   };

//   const handleLeaveRequest = (leaveData) => {
//     requestLeave.mutate(
//       {
//         leaveType: leaveData.leaveType,
//         startDate: leaveData.startDate,
//         endDate: leaveData.endDate,
//         remarks: leaveData.remarks,
//       },
//       {
//         onSuccess: () => {
//           refetch();
//           setShowLeaveModal(false);
//         },
//       }
//     );
//   };

//   return (
//     <div className="min-h-screen p-4 md:p-8">

//       <div className="w-full bg-gradient-to-r from-white via-blue-50 to-white border border-blue-100 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(37,99,235,0.08)] px-4 sm:px-6 py-4 sm:py-5 mb-7 overflow-hidden">
//         <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5 sm:gap-6">
//           <div className="flex-1 min-w-0">
//             <AttendanceHeader
//               attendance={attendance}
//               workingHours={workingHours}
//             />
//           </div>

//           <div className="w-full 2xl:w-auto flex 2xl:justify-end">
//             <AttendanceActions
//               handlePunch={handlePunch}
//               setShowLeaveModal={setShowLeaveModal}
//               isPunchedIn={isPunchedIn}
//               punchIn={punchIn}
//               punchOut={punchOut}
//             />
//           </div>
//         </div>
//       </div>

//       <AttendanceSummary historyData={historyData} />

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <div className="bg-white rounded-2xl shadow-md p-4">
//           <AttendanceCalendar
//             records={historyData?.attendance || []}
//           />
//         </div>

//         <AttendanceHistoryTable historyData={historyData} />
//       </div>

//       <div className="mt-6">
//         <MyLeaveRequests />
//       </div>

//       <LeaveModal
//         showLeaveModal={showLeaveModal}
//         setShowLeaveModal={setShowLeaveModal}
//         handleLeaveRequest={handleLeaveRequest}
//       />

//     </div>
//   );
// };

// export default AttendancePage;

"use client";

import React, { useState } from "react";

import {
  usePunchIn,
  usePunchOut,
  useTodayAttendance,
  useAttendanceHistory,
  useRequestLeave,
} from "../../hooks/useAttendanceMutations";

import AttendanceCalendar from "../../components/attendance/AttendanceCalander";
import AttendanceHeader from "../../components/attendance/AttendanceHeader";
import AttendanceActions from "../../components/attendance/AttendanceActions";
import AttendanceSummary from "../../components/attendance/AttendanceSummary";
import AttendanceHistoryTable from "../../components/attendance/AttendanceHistoryTable";
import LeaveModal from "../../components/attendance/LeaveModel";
import MyLeaveRequests from "../../components/attendance/MyLeaveRequests";
import AttendanceCorrectionForm from "../../components/attendance/AttendanceCorrectionForm";

const AttendancePage = () => {

  // LEAVE MODAL

  const [
    showLeaveModal,
    setShowLeaveModal,
  ] = useState(false);

  // CORRECTION MODAL

  const [
    showCorrectionModal,
    setShowCorrectionModal,
  ] = useState(false);

  // SELECTED ATTENDANCE

  const [
    selectedAttendance,
    setSelectedAttendance,
  ] = useState(null);

  const [
    historyView,
    setHistoryView,
  ] = useState("monthly");

  // ATTENDANCE DATA

  const { data, refetch } =
    useTodayAttendance();

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useAttendanceHistory(
    historyView
  );

  // MUTATIONS

  const punchIn =
    usePunchIn();

  const punchOut =
    usePunchOut();

  const requestLeave =
    useRequestLeave();

  // TODAY ATTENDANCE

  const attendance =
    data?.attendance;

  // CHECK PUNCHED IN

  const isPunchedIn =
    attendance?.punchInTime &&
    !attendance?.punchOutTime;

  // CALCULATE WORKING HOURS

  const calculateHours = (
    inTime,
    outTime
  ) => {

    if (!inTime)
      return "0h 0m";

    const start =
      new Date(inTime);

    const end = outTime
      ? new Date(outTime)
      : new Date();

    const totalMinutes =
      Math.floor(
        (end - start) /
          (1000 * 60)
      );

    const hours =
      Math.floor(
        totalMinutes / 60
      );

    const minutes =
      totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const workingHours =
    calculateHours(
      attendance?.punchInTime,
      attendance?.punchOutTime
    );

  // HANDLE PUNCH

  const handlePunch = () => {

    if (isPunchedIn) {

      punchOut.mutate(
        null,
        {
          onSuccess: () => {
            refetch();
          },
        }
      );

    } else {

      punchIn.mutate(
        null,
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
  };

  // HANDLE LEAVE

  const handleLeaveRequest = (
    leaveData
  ) => {

    requestLeave.mutate(
      {
        leaveType:
          leaveData.leaveType,

        startDate:
          leaveData.startDate,

        endDate:
          leaveData.endDate,

        remarks:
          leaveData.remarks,
      },

      {
        onSuccess: () => {

          refetch();

          setShowLeaveModal(
            false
          );
        },
      }
    );
  };

  return (

    <div className="min-h-screen p-4 md:p-8">

      {/* HEADER CARD */}

      <div className="w-full bg-gradient-to-r from-white via-blue-50 to-white border border-blue-100 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(37,99,235,0.08)] px-4 sm:px-6 py-4 sm:py-5 mb-7 overflow-hidden">

        <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-5 sm:gap-6">

          {/* LEFT */}

          <div className="flex-1 min-w-0">

            <AttendanceHeader
              attendance={
                attendance
              }
              workingHours={
                workingHours
              }
            />

          </div>

          {/* RIGHT */}

          <div className="w-full 2xl:w-auto flex 2xl:justify-end">

            <AttendanceActions
              handlePunch={
                handlePunch
              }
              setShowLeaveModal={
                setShowLeaveModal
              }
              setShowCorrectionModal={
                setShowCorrectionModal
              }
              isPunchedIn={
                isPunchedIn
              }
              punchIn={
                punchIn
              }
              punchOut={
                punchOut
              }
            />

          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-bold text-[#0F172A]">
          Attendance Overview
        </h2>

        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {[
            "daily",
            "weekly",
            "monthly",
          ].map((view) => (
            <button
              key={view}
              type="button"
              onClick={() =>
                setHistoryView(view)
              }
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                historyView === view
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <AttendanceSummary
        historyData={
          historyData
        }
        view={historyView}
      />

      {historyError && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          Could not load attendance history. Please try again.
        </div>
      )}

      {/* CONTENT */}

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">

        {/* CALENDAR */}

        <div className="flex h-[560px] rounded-3xl bg-white p-4 shadow-md">

          <AttendanceCalendar
            records={
              historyData?.attendance ||
              []
            }
          />

        </div>

        {/* HISTORY TABLE */}

        <AttendanceHistoryTable
          historyData={
            historyData
          }
          isLoading={
            historyLoading
          }
          setShowCorrectionModal={
            setShowCorrectionModal
          }
          setSelectedAttendance={
            setSelectedAttendance
          }
        />

      </div>

      {/* MY LEAVE REQUESTS */}

      <div className="mt-6">

        <MyLeaveRequests />

      </div>

      {/* LEAVE MODAL */}

      <LeaveModal
        showLeaveModal={
          showLeaveModal
        }
        setShowLeaveModal={
          setShowLeaveModal
        }
        handleLeaveRequest={
          handleLeaveRequest
        }
      />

      {/* CORRECTION MODAL */}

      {showCorrectionModal && (

        <AttendanceCorrectionForm

          attendanceId={
            selectedAttendance?._id
          }

          selectedAttendance={
            selectedAttendance
          }

          setShowCorrectionModal={
            setShowCorrectionModal
          }

          refetch={refetch}

        />

      )}

    </div>
  );
};

export default AttendancePage;
