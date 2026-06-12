"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles/calander.css";

const AttendanceCalendar = ({ records = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDateKey = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const attendanceMap = {};
  records.forEach((r) => {
    const key = r.dayKey || (r.punchInTime ? formatDateKey(r.punchInTime) : null);
    if (!key) return;
    attendanceMap[key] = r;
  });

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "—";

    const diffMs = new Date(outTime) - new Date(inTime);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  };

  const selectedRecord =
    selectedDate &&
    attendanceMap[formatDateKey(selectedDate)];

  return (
    <div className="flex h-full min-h-0 w-full flex-col justify-start overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 sm:p-6">

      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        prev2Label="<<"
        prevLabel="<"
        nextLabel=">"
        next2Label=">>"
        formatShortWeekday={(locale, date) =>
          date
            .toLocaleDateString(locale, {
              weekday: "short",
            })
            .toUpperCase()
        }
        tileClassName={({ date }) => {
          const key = formatDateKey(date);

          if (
            selectedDate &&
            formatDateKey(date) ===
              formatDateKey(selectedDate)
          ) {
            return "custom-selected";
          }

          if (attendanceMap[key]) {
            return "custom-present";
          }

          return "custom-default";
        }}
      />

      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm shadow-xl">

            <h3 className="font-bold text-lg text-[#0F172A] mb-4">
              Attendance Details
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Date:</strong>{" "}
                {selectedRecord.dayKey ||
                  new Date(selectedRecord.punchInTime).toDateString()}
              </p>

              <p>
                <strong>Punch In:</strong>{" "}
                {new Date(
                  selectedRecord.punchInTime
                ).toLocaleTimeString()}
              </p>

              <p>
                <strong>Punch Out:</strong>{" "}
                {selectedRecord.punchOutTime
                  ? new Date(
                      selectedRecord.punchOutTime
                    ).toLocaleTimeString()
                  : "Not Punched Out"}
              </p>

              <p className="font-semibold text-blue-600">
                <strong>Working Hours:</strong>{" "}
                {calculateHours(
                  selectedRecord.punchInTime,
                  selectedRecord.punchOutTime
                )}
              </p>
            </div>

            <button
              onClick={() => setSelectedDate(null)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
