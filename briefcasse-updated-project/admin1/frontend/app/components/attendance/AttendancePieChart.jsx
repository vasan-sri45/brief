"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#facc15"]; // Blue, Red, Yellow

const AttendancePieChart = ({ records = [] }) => {

  // 🔥 CALCULATE DATA
  let present = 60;
  let absent = 30;
  let halfDay = 10;

  records.forEach((r) => {
    if (r.punchInTime && r.punchOutTime) {
      present++;
    } else if (r.punchInTime && !r.punchOutTime) {
      halfDay++; // still working / incomplete
    } else {
      absent++;
    }
  });

  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Half Day", value: halfDay },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md">

      <h3 className="text-lg font-bold text-custom-blue mb-3 text-center">
        Attendance Report
      </h3>

      <ResponsiveContainer width="100%" height={250} >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default AttendancePieChart;