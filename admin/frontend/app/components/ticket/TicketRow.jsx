"use client";
import React from "react";

const TicketRow = ({
  checked = false,
  client = "Client No 1",
  date = "June 24, 2025",
  ticketNo = "01",
  status = "Availed",
  onView, // ✅ ADD THIS
}) => {
  const isAvailed = status === "Availed";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-6 py-4 border-b-2 mx-6 border-b-custom-blue">

        {/* LEFT */}
        <div className="flex items-start gap-4 min-w-[260px]">
          <input
            type="checkbox"
            defaultChecked={checked}
            className="mt-1 w-4 h-4 accent-custom-blue"
          />

          <div>
            <p className="text-gray-800 font-medium">{client}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          <span className="h-6 w-[3px] bg-custom-blue" />

          <p className="text-gray-900 font-medium whitespace-nowrap">
            Ticket No : {ticketNo}
          </p>

          <span className="h-6 w-[3px] bg-custom-blue" />

          <div className="flex items-center gap-2 min-w-[110px]">
            <span
              className={`w-3 h-3 rounded-full ${
                isAvailed ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="font-medium text-gray-800">{status}</span>
          </div>

          <span className="h-6 w-[3px] bg-custom-blue" />

          {/* ✅ VIEW BUTTON FIX */}
          <button
            onClick={onView}     // 🔥 THIS LINE FIXES EVERYTHING
            className="bg-[#E2AF5F] hover:bg-[#d9a24a] text-white px-6 py-2 rounded-full font-medium transition whitespace-nowrap"
          >
            View →
          </button>

        </div>
      </div>
    </div>
  );
};

export default TicketRow;
