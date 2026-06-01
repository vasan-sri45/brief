import Attendance from "../../models/attendance/attendance.model.js";
import LeaveRequest from "../../models/attendance/leave.model.js";
import AttendanceCorrection from "../../models/attendance/attendanceCorrection.model.js";
import { startEndOfDayUTC } from "../../utils/date.js";

const LATE_HOUR = 10;
const FULL_DAY_MINUTES = 480;
const HALF_DAY_MINUTES = 240;

const getAttendanceStatus = ({ punchInTime, totalMinutes = 0 }) => {
  if (totalMinutes > 0 && totalMinutes < HALF_DAY_MINUTES) return "Half-Day";
  if (!punchInTime) return "Absent";

  const punchIn = new Date(punchInTime);
  const isLate =
    punchIn.getHours() > LATE_HOUR ||
    (punchIn.getHours() === LATE_HOUR && punchIn.getMinutes() > 0);

  return isLate ? "Late" : "Present";
};

const formatWorkingHours = (minutes = 0) => {
  const safeMinutes = Math.max(0, minutes);
  return `${Math.floor(safeMinutes / 60)}h ${safeMinutes % 60}m`;
};

const formatDayKey = (date) => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRangeKeys = (view = "monthly", query = {}) => {
  const now = new Date();
  const today = formatDayKey(now);

  if (query.startDate && query.endDate) {
    return { startKey: query.startDate, endKey: query.endDate };
  }

  if (view === "daily") return { startKey: today, endKey: today };

  if (view === "weekly") {
    const start = new Date(now);
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(now.getDate() + mondayOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      startKey: formatDayKey(start),
      endKey: formatDayKey(end),
    };
  }

  const year = parseInt(query.year, 10) || now.getFullYear();
  const month = String(parseInt(query.month, 10) || now.getMonth() + 1).padStart(2, "0");
  return {
    startKey: `${year}-${month}-01`,
    endKey: `${year}-${month}-31`,
  };
};

export const punchIn = async (req, res) => {
  try {
    const employee_id = req.user._id;
    const { dayKey } = startEndOfDayUTC();

    const existingAttendance = await Attendance.findOne({
      employee_id,
      dayKey,
    });

    if (existingAttendance) {
      if (existingAttendance.punchInTime) {
        return res.status(400).json({
          success: false,
          message: "Already punched in today",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Cannot punch in. Your status for today is already marked as ${existingAttendance.attendanceStatus}`,
        });
      }
    }

    const attendance = await Attendance.create({
      employee_id,
      dayKey,
      punchInTime: new Date(),
      attendanceStatus: getAttendanceStatus({ punchInTime: new Date(), totalMinutes: FULL_DAY_MINUTES }),
    });

    return res.status(201).json({
      success: true,
      message: "Punch In Successful",
      attendance,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const punchOut = async (req, res) => {
  try {
    const employee_id = req.user._id;
    const { dayKey } = startEndOfDayUTC();

    const attendance = await Attendance.findOne({
      employee_id,
      dayKey,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    if (!attendance.punchInTime) {
      return res.status(400).json({
        success: false,
        message: `Cannot punch out. Your status for today is marked as ${attendance.attendanceStatus}`,
      });
    }

    if (attendance.punchOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already punched out today",
      });
    }

    attendance.punchOutTime = new Date();

    const diffInMs = new Date(attendance.punchOutTime).getTime() - new Date(attendance.punchInTime).getTime();
    const totalMinutes = Math.max(0, Math.floor(diffInMs / (1000 * 60)));

    attendance.totalMinutes = totalMinutes;
    attendance.attendanceStatus = getAttendanceStatus({
      punchInTime: attendance.punchInTime,
      totalMinutes,
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Punch Out Successful",
      attendance,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const employee_id = req.user._id;
    const { dayKey } = startEndOfDayUTC();

    const attendance = await Attendance.findOne({
      employee_id,
      dayKey,
    });

    if (!attendance) {
      return res.status(200).json({
        success: true,
        attendance: null,
        todayWorkingHours: "0h 0m",
      });
    }

    let todayWorkingHours = attendance.workingHours;

    if (attendance.punchInTime && !attendance.punchOutTime) {
      const diff = Date.now() - new Date(attendance.punchInTime).getTime();
      const runningMinutes = Math.max(0, Math.floor(diff / (1000 * 60)));
      
      const hours = Math.floor(runningMinutes / 60);
      const minutes = runningMinutes % 60;
      todayWorkingHours = `${hours}h ${minutes}m`;
    }

    return res.status(200).json({
      success: true,
      attendance,
      todayWorkingHours,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const requestLeave = async (req, res) => {
  try {
    const employee_id = req.user._id;

    const {
      leaveType,
      startDate,
      endDate,
      remarks,
    } = req.body;

    const allowedLeaveTypes = [
      "Sick Leave",
      "Casual Leave",
      "Emergency Leave",
    ];

    if (
      !allowedLeaveTypes.includes(
        leaveType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Leave Type",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message:
          "Start date cannot be greater than end date",
      });
    }

    // =====================================
    // TOTAL DAYS
    // =====================================

    const diffTime =
      end.getTime() - start.getTime();

    const totalDays =
      Math.floor(
        diffTime /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // =====================================
    // CREATE LEAVE REQUEST
    // =====================================

    const leaveRequest =
      await LeaveRequest.create({
        employee_id,

        leaveType,

        startDate: start,

        endDate: end,

        totalDays,

        remarks:
          remarks?.trim() || "",

        status: "Pending",
      });

    return res.status(201).json({
      success: true,

      message:
        "Leave request submitted successfully",

      leaveRequest,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,

      message:
        err.message ||
        "Internal Server Error",
    });
  }
};


export const getAttendanceHistory = async (req, res) => {
  try {
    const employee_id = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { startKey, endKey } = getDateRangeKeys(req.query.view, req.query);

    const query = {
      employee_id,
      dayKey: {
        $gte: startKey,
        $lte: endKey,
      },
    };

    const records = await Attendance.find(query)
      .sort({ dayKey: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Attendance.countDocuments(query);

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalRecords,
      attendance: records,
      summary: {
        present: records.filter((item) => ["Present", "Late"].includes(item.attendanceStatus)).length,
        absent: records.filter((item) => item.attendanceStatus === "Absent").length,
        late: records.filter((item) => item.attendanceStatus === "Late").length,
        halfDay: records.filter((item) => item.attendanceStatus === "Half-Day").length,
        workingHours: formatWorkingHours(
          records.reduce((sum, item) => sum + (item.totalMinutes || 0), 0)
        ),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getMyLeaveRequests = async (req, res) => {
  try {

    const employee_id = req.user._id;

    const leaveRequests =
      await LeaveRequest.find({
        employee_id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      leaveRequests,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const requestAttendanceCorrection =
  async (req, res) => {
    try {

      const employee_id = req.user._id;

      const {
        attendance_id,
        correctionType,
        requestedPunchInTime,
        requestedPunchOutTime,
        reason,
      } = req.body;

      const attendance =
        await Attendance.findOne({
          _id: attendance_id,
          employee_id,
        });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance not found",
        });
      }

      const existingRequest =
        await AttendanceCorrection.findOne({
          attendance_id,
          status: "Pending",
        });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message:
            "Request already pending",
        });
      }

      const correction =
        await AttendanceCorrection.create({
          employee_id,

          attendance_id,

          correctionType,

          requestedPunchInTime,

          requestedPunchOutTime,

          reason,
        });

      attendance.attendanceStatus =
        "Pending Correction";

      await attendance.save();

      return res.status(201).json({
        success: true,

        message:
          "Correction request submitted",

        correction,
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
