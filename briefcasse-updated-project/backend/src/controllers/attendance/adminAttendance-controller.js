import Attendance from "../../models/attendance/attendance.model.js";
import Leave from "../../models/attendance/leave.model.js";
import Employee from "../../models/auth/employee.js";
import AttendanceCorrection from "../../models/attendance/attendanceCorrection.model.js";
import { startEndOfDayUTC } from "../../utils/date.js";

const ACTIVE_STATUSES = [
  "Present",
  "Late",
  "Half-Day",
  "Sick Leave",
  "Casual Leave",
  "Emergency Leave",
  "LOP",
];

const LEAVE_STATUSES = [
  "Sick Leave",
  "Casual Leave",
  "Emergency Leave",
];

const calculateStatus = (punchInTime, totalMinutes = 0) => {
  if (totalMinutes > 0 && totalMinutes < 240) return "Half-Day";
  if (!punchInTime) return "Absent";

  const punchIn = new Date(punchInTime);
  const isLate =
    punchIn.getHours() > 10 ||
    (punchIn.getHours() === 10 && punchIn.getMinutes() > 0);

  return isLate ? "Late" : "Present";
};

const buildSummary = (attendance, totalEmployees) => {
  const presentToday = attendance.filter((item) =>
    ["Present", "Late"].includes(item.attendanceStatus)
  ).length;
  const lateToday = attendance.filter((item) => item.attendanceStatus === "Late").length;
  const onLeave = attendance.filter((item) => LEAVE_STATUSES.includes(item.attendanceStatus)).length;
  const halfDay = attendance.filter((item) => item.attendanceStatus === "Half-Day").length;
  const lopToday = attendance.filter((item) => item.attendanceStatus === "LOP").length;
  const absentToday =
    totalEmployees -
    attendance.filter((item) => ACTIVE_STATUSES.includes(item.attendanceStatus)).length;

  return {
    presentToday,
    absentToday: Math.max(0, absentToday),
    lateToday,
    onLeave,
    halfDay,
    lopToday,
    totalWorkingMinutes: attendance.reduce((sum, item) => sum + (item.totalMinutes || 0), 0),
  };
};
// =======================================
// ADMIN: TODAY ATTENDANCE DASHBOARD
// =======================================

export const getAdminTodayAttendance = async (req, res) => {
  try {
    const { dayKey } = startEndOfDayUTC();

    const [totalEmployees, attendance] = await Promise.all([
      Employee.countDocuments({ role: "employee" }),
      Attendance.find({ dayKey })
        .select("employee_id dayKey punchInTime punchOutTime totalMinutes attendanceStatus remarks createdAt")
        .populate(
          "employee_id",
          "name employee_id email mobile role profileImage"
        )
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const summary = buildSummary(attendance, totalEmployees);

    return res.status(200).json({
      success: true,
      dayKey,
      totalEmployees,
      ...summary,
      attendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// ADMIN: MONTHLY ATTENDANCE REPORT
// =======================================

export const getAdminMonthlyAttendance = async (req, res) => {
  try {
    const month =
      parseInt(req.query.month) || new Date().getMonth() + 1;

    const year =
      parseInt(req.query.year) || new Date().getFullYear();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const monthKey = String(month).padStart(2, "0");

    const startKey = `${year}-${monthKey}-01`;
    const endKey = `${year}-${monthKey}-31`;

    const query = {
      dayKey: {
        $gte: startKey,
        $lte: endKey,
      },
    };

    const [attendance, totalRecords, totalEmployees] = await Promise.all([
      Attendance.find(query)
        .select("employee_id dayKey punchInTime punchOutTime totalMinutes attendanceStatus remarks createdAt")
        .populate(
          "employee_id",
          "name employee_id email mobile role profileImage"
        )
        .sort({ dayKey: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Attendance.countDocuments(query),
      Employee.countDocuments({ role: "employee" }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);
    const summary = buildSummary(attendance, totalEmployees);

    return res.status(200).json({
      success: true,
      month,
      year,
      currentPage: page,
      totalPages,
      totalRecords,
      totalEmployees,
      ...summary,
      attendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// ADMIN: ALTER ATTENDANCE
// =======================================

export const adminAlterAttendance = async (req, res) => {
  try {
    const {
      attendanceId,
      newStatus,
      remarks,
    } = req.body;

    const allowedStatus = [
      "Present",
      "Late",
      "Half-Day",
      "Absent",
      "Sick Leave",
      "Casual Leave",
      "LOP",
      "Emergency Leave",
    ];

    if (!attendanceId || !newStatus) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance ID and status are required",
      });
    }

    if (
      !allowedStatus.includes(
        newStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid attendance status",
      });
    }

    const attendance =
      await Attendance.findById(
        attendanceId
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message:
          "Attendance not found",
      });
    }

    // =======================================
    // UPDATE STATUS
    // =======================================

    attendance.attendanceStatus =
      newStatus;

    attendance.adminApproved = true;

    attendance.remarks =
      remarks ||
      "Altered by Admin";

    // =======================================
    // TOTAL MINUTES
    // =======================================

    if (newStatus === "Present") {

      attendance.totalMinutes = 480;

    } else if (newStatus === "Late") {

      attendance.totalMinutes = attendance.totalMinutes || 480;

    } else if (
      newStatus === "Half-Day"
    ) {

      attendance.totalMinutes = 240;

    } else {

      attendance.totalMinutes = 0;

      attendance.punchInTime = null;

      attendance.punchOutTime = null;
    }

    await attendance.save();

    // =======================================
    // POPULATE EMPLOYEE
    // =======================================

    const updatedAttendance =
      await Attendance.findById(
        attendance._id
      ).populate(
        "employee_id",
        "name employee_id email mobile role profileImage"
      );

    return res.status(200).json({
      success: true,

      message:
        "Attendance updated successfully",

      attendance:
        updatedAttendance,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,

      message:
        err.message,
    });
  }
};

const formatDayKey = (date) => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAdminPendingLeaves = async (req, res) => {
  const leaveRequests = await Leave.find({
    status: "Pending",
  })
    .select("employee_id leaveType startDate endDate totalDays remarks status createdAt")
    .populate(
      "employee_id",
      "name employee_id email mobile"
    )
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    leaveRequests,
  });
};

export const adminLeaveAction = async (req, res) => {
  try {
    const {
      leaveRequestId,
      action,
      adminRemarks,
    } = req.body;

    const leave = await Leave.findById(
      leaveRequestId
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message:
          "Leave request not found",
      });
    }

    // ======================================
    // REJECT LEAVE
    // ======================================

    if (action === "reject") {

      leave.status = "Rejected";

      leave.adminRemarks =
        adminRemarks ||
        "Rejected by Admin";

      await leave.save();

      return res.status(200).json({
        success: true,
        message: "Leave rejected",
        leave,
      });
    }

    // ======================================
    // APPROVE LEAVE
    // ======================================

    if (action === "approve") {

      leave.status = "Approved";

      leave.adminRemarks =
        adminRemarks ||
        "Approved by Admin";

      await leave.save();

      let currentDate =
        new Date(leave.startDate);

      const endDate =
        new Date(leave.endDate);

      while (
        currentDate <= endDate
      ) {

        const dayKey =
          formatDayKey(currentDate);

        await Attendance.findOneAndUpdate(
          {
            employee_id:
              leave.employee_id,

            dayKey,
          },

          {
            employee_id:
              leave.employee_id,

            dayKey,

            attendanceStatus:
              leave.leaveType,

            adminApproved: true,

            totalMinutes: 0,

            punchInTime: null,

            punchOutTime: null,

            remarks:
              leave.remarks ||
              "Approved leave",
          },

          {
            upsert: true,
            new: true,
          }
        );

        currentDate.setDate(
          currentDate.getDate() + 1
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Leave approved and attendance updated",
        leave,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid action",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.dayKey = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const attendance = await Attendance.find(query)
      .select("employee_id dayKey punchInTime punchOutTime totalMinutes attendanceStatus remarks createdAt")
      .populate("employee_id", "name employee_id email mobile")
      .sort({ dayKey: -1 })
      .lean();

    res.status(200).json({
      success: true,
      totalRecords: attendance.length,
      attendance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPendingCorrections =
  async (req, res) => {

    const corrections =
      await AttendanceCorrection.find({
        status: "Pending",
      })

        .populate(
          "employee_id",
          "name employee_id email"
        )

        .populate("attendance_id")

        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      corrections,
    });
};

export const adminCorrectionAction =
  async (req, res) => {
    try {

      const {
        correctionId,
        action,
        adminRemarks,
      } = req.body;

      const correction =
        await AttendanceCorrection.findById(
          correctionId
        );

      if (!correction) {
        return res.status(404).json({
          success: false,
          message:
            "Correction request not found",
        });
      }

      const attendance =
        await Attendance.findById(
          correction.attendance_id
        );

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance not found",
        });
      }

      // REJECT

      if (action === "reject") {

        correction.status =
          "Rejected";

        correction.adminRemarks =
          adminRemarks ||
          "Rejected by admin";

        attendance.attendanceStatus =
          "LOP";

        await correction.save();

        await attendance.save();

        return res.status(200).json({
          success: true,
          message:
            "Correction rejected",
        });
      }

      // APPROVE

      correction.status =
        "Approved";

      correction.adminRemarks =
        adminRemarks ||
        "Approved by admin";

      if (
        correction.requestedPunchInTime
      ) {
        attendance.punchInTime =
          correction.requestedPunchInTime;
      }

      if (
        correction.requestedPunchOutTime
      ) {
        attendance.punchOutTime =
          correction.requestedPunchOutTime;
      }

      const diffInMs =
        new Date(
          attendance.punchOutTime
        ).getTime() -

        new Date(
          attendance.punchInTime
        ).getTime();

      const totalMinutes =
        Math.max(
          0,
          Math.floor(
            diffInMs /
              (1000 * 60)
          )
        );

      attendance.totalMinutes =
        totalMinutes;

      attendance.adminApproved =
        true;
      attendance.attendanceStatus = calculateStatus(
        attendance.punchInTime,
        totalMinutes
      );

      await correction.save();

      await attendance.save();

      return res.status(200).json({
        success: true,
        message:
          "Correction approved successfully",
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
