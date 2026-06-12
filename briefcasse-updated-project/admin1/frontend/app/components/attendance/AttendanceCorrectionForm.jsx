"use client";

import React, { useState } from "react";
import { CalendarClock, Send, X } from "lucide-react";
import { useRequestAttendanceCorrection } from "../../hooks/useAttendanceCorrectionMutations";

const AttendanceCorrectionForm = ({
  attendanceId,
  selectedAttendance,
  setShowCorrectionModal,
  refetch,
}) => {
  const [formData, setFormData] = useState({
    correctionType: "Missing Punch Out",
    requestedPunchInTime: "",
    requestedPunchOutTime: "",
    reason: "",
  });

  const { mutate, isPending } = useRequestAttendanceCorrection();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!attendanceId) {
      alert("Please select an attendance record first");
      return;
    }

    if (!formData.reason.trim()) {
      alert("Please enter a reason for correction");
      return;
    }

    mutate({
      ...formData,
      attendance_id: attendanceId,
    }, {
      onSuccess: (data) => {
        alert(data.message);
        refetch();
        setShowCorrectionModal(false);
      },
      onError: (error) => {
        alert(
          error?.response?.data?.message ||
            "Something went wrong"
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-blue-100 bg-white shadow-[0_25px_90px_rgba(15,23,42,0.25)]">
        <button
          onClick={() => setShowCorrectionModal(false)}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <X size={18} />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <CalendarClock size={24} />
          </div>

          <h2 className="text-2xl font-extrabold">
            Attendance Correction
          </h2>

          <p className="mt-1 text-sm font-medium text-blue-100">
            Date: {selectedAttendance?.dayKey || "-"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <select
            name="correctionType"
            value={formData.correctionType}
            onChange={handleChange}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option>Missing Punch In</option>
            <option>Missing Punch Out</option>
            <option>Missing Both</option>
          </select>

          <input
            type="datetime-local"
            name="requestedPunchInTime"
            value={formData.requestedPunchInTime}
            onChange={handleChange}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="datetime-local"
            name="requestedPunchOutTime"
            value={formData.requestedPunchOutTime}
            onChange={handleChange}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason for correction"
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <button
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-blue-100 disabled:opacity-60"
          >
            <Send size={18} />
            {isPending ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceCorrectionForm;
