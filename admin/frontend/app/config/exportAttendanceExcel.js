import * as XLSX from "xlsx";

export const exportAttendanceExcel = (attendance = []) => {
  const rows = attendance.map((item) => ({
    Date: item.dayKey,
    Employee: item.employee_id?.name || "Employee",
    Code: item.employee_id?.employee_id || "--",
    Status: item.attendanceStatus,
    "Punch In": item.punchInTime
      ? new Date(item.punchInTime).toLocaleTimeString()
      : "--",
    "Punch Out": item.punchOutTime
      ? new Date(item.punchOutTime).toLocaleTimeString()
      : "--",
    Hours: item.workingHours || "0h 0m",
    Remarks: item.remarks || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  XLSX.writeFile(workbook, "attendance-report.xlsx");
};