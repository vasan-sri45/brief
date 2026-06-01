import Employee from '../../models/auth/employee.js';
import Attendance from '../../models/attendance/attendance.model.js';
import PersonalDetails from "../../models/auth/employeeDetails.model.js";
import PayrollSettings from "../../models/payroll/payroll.model.js";
import LopRecovery from "../../models/payroll/lopRecovery.model.js";

const nextMonth = (month, year) => {
  const value = Number(month);
  if (value === 12) return { month: 1, year: Number(year) + 1 };
  return { month: value + 1, year: Number(year) };
};

const countWorkingDays = (startDate, endDate) => {
  if (!startDate || !endDate || startDate > endDate) return 0;

  let count = 0;
  const cursor = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  while (cursor <= end) {
    if (cursor.getDay() !== 0) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
};

const isSundayDayKey = (dayKey) => {
  if (!dayKey) return false;
  const date = new Date(`${dayKey}T00:00:00`);
  return date.getDay() === 0;
};

const getPayrollPeriod = (employee, month, year) => {
  const monthIndex = Number(month) - 1;
  const targetYear = Number(year);
  const monthStart = new Date(targetYear, monthIndex, 1);
  const monthEnd = new Date(targetYear, monthIndex + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const salaryBaseDays = countWorkingDays(monthStart, monthEnd);
  const joiningDate = employee.dateOfJoining
    ? new Date(employee.dateOfJoining)
    : employee.createdAt
    ? new Date(employee.createdAt)
    : monthStart;

  if (joiningDate > monthEnd) {
    return {
      daysInMonth,
      salaryBaseDays,
      workingDays: 0,
      startKey: null,
      endKey: null,
    };
  }

  const activeStart = monthStart;
  const workingDays = countWorkingDays(monthStart, monthEnd);

  const formatKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;

  return {
    daysInMonth,
    salaryBaseDays,
    workingDays,
    startKey: formatKey(activeStart),
    endKey: formatKey(monthEnd),
  };
};

const payrollForEmployee = async (employee, month, year, settings = {}) => {
  const targetMonth = String(month).padStart(2, "0");
  const targetYear = String(year);
  const payrollPeriod = getPayrollPeriod(employee, month, year);
  const personalDetails = await PersonalDetails.findOne({
    employee: employee._id,
  });

  const attendance = payrollPeriod.startKey
    ? await Attendance.find({
        employee_id: employee._id,
        dayKey: {
          $gte: payrollPeriod.startKey,
          $lte: payrollPeriod.endKey,
        },
      })
    : [];

  const workingDayAttendance = attendance.filter(
    (item) => !isSundayDayKey(item.dayKey)
  );

  const presentDays = workingDayAttendance.filter((item) =>
    ["Present", "Late"].includes(item.attendanceStatus)
  ).length;
  const halfDays = workingDayAttendance.filter(
    (item) => item.attendanceStatus === "Half-Day"
  ).length;
  const absenceDays = workingDayAttendance.filter((item) =>
    ["Absent", "Casual Leave", "Sick Leave", "Emergency Leave"].includes(
      item.attendanceStatus
    )
  ).length;
  const directLopDays = workingDayAttendance.filter(
    (item) => item.attendanceStatus === "LOP"
  ).length;
  const casualLeaveDays = Math.min(absenceDays, 1);
  const lopDays = directLopDays + Math.max(absenceDays - casualLeaveDays, 0);
  const totalWorkingDays = payrollPeriod.workingDays;
  let basicSalary = Number(employee.basicSalary || 0);
  const hra = Number(employee.hra || 0);
  const conveyanceAllowance = Number(employee.conveyanceAllowance || 0);
  const medicalAllowance = Number(employee.medicalAllowance || 0);
  let specialAllowance = Number(employee.specialAllowance || 0);
  const componentGross =
    basicSalary + hra + conveyanceAllowance + medicalAllowance + specialAllowance;
  const monthlySalary = componentGross || Number(employee.salaryPerMonth || 0);
  if (!basicSalary && monthlySalary) {
    basicSalary = Math.round(monthlySalary * 0.48);
    specialAllowance = Math.max(
      0,
      monthlySalary - basicSalary - hra - conveyanceAllowance - medicalAllowance
    );
  }
  const perDaySalary = payrollPeriod.salaryBaseDays
    ? monthlySalary / payrollPeriod.salaryBaseDays
    : 0;
  const lopDeduction = Math.round(lopDays * perDaySalary);
  const paidDays = presentDays + halfDays * 0.5 + casualLeaveDays;
  const earnedSalary = Math.round(paidDays * perDaySalary);
  const allowances = Number(settings.allowances || 0);
  const isOnRole = employee.employmentType === "on-role";
  const hasSalaryForStatutory = monthlySalary + allowances > 0;
  const pf = isOnRole && hasSalaryForStatutory ? Math.round((basicSalary * 12) / 100) : 0;
  const employerPf = isOnRole && hasSalaryForStatutory ? Math.round((basicSalary * 12) / 100) : 0;
  const esi = isOnRole && hasSalaryForStatutory && monthlySalary <= 21000
    ? Math.round((monthlySalary * 0.75) / 100)
    : 0;
  const employerEsi = isOnRole && hasSalaryForStatutory && monthlySalary <= 21000
    ? Math.round((monthlySalary * 3.25) / 100)
    : 0;
  const professionalTax = isOnRole && hasSalaryForStatutory ? Number(settings.professionalTax || 0) : 0;
  const tds = isOnRole && hasSalaryForStatutory ? Number(settings.tds || 0) : 0;
  const statutoryDeduction = pf + esi + professionalTax + tds;

  const approvedRecovery = await LopRecovery.find({
    employee_id: employee._id,
    applyMonth: Number(month),
    applyYear: Number(year),
    status: "Approved",
  }).lean();

  const pendingRecovery = await LopRecovery.find({
    employee_id: employee._id,
    applyMonth: Number(month),
    applyYear: Number(year),
    status: "Pending",
  }).lean();

  const lopRecoveryAmount = approvedRecovery.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const payableSalary = Math.max(
    0,
    earnedSalary + allowances + lopRecoveryAmount - lopDeduction - statutoryDeduction
  );

  return {
    employeeId: employee._id,
    employeeName: employee.name,
    employeeCode: employee.employee_id,
    department: employee.department || "",
    designation: employee.designation || "",
    dateOfJoining: employee.dateOfJoining || employee.createdAt,
    panNo: employee.panNumber || personalDetails?.panNo || "",
    uanNumber: employee.uanNumber || "",
    esiNumber: employee.esiNumber || "",
    employmentType: employee.employmentType || "off-role",
    fatherName: personalDetails?.fatherName || "",
    motherName: personalDetails?.motherName || "",
    address: personalDetails?.address || "",
    location: personalDetails?.location || "",
    accountNo: employee.bankAccountNumber || personalDetails?.accountNo || "",
    ifscNo: employee.ifscCode || personalDetails?.ifscNo || "",
    bankName: personalDetails?.bankName || "",
    branchName: personalDetails?.branchName || "",
    monthlySalary,
    basicSalary,
    hra,
    conveyanceAllowance,
    medicalAllowance,
    specialAllowance,
    annualCtc: employee.annualCtc || monthlySalary * 12,
    earnedSalary,
    allowances,
    pf,
    employerPf,
    esi,
    employerEsi,
    professionalTax,
    tds,
    statutoryDeduction,
    presentDays,
    halfDays,
    casualLeaveDays,
    lopDays,
    totalWorkingDays,
    paidDays,
    lopDeduction,
    lopRecoveryAmount,
    pendingRecovery,
    payableSalary,
  };
};

export const getMonthlyPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;

    const employees = await Employee.find();
    const settings = (await PayrollSettings.findOne().lean()) || {};

    const payroll = [];

    for (const employee of employees) {
      payroll.push(await payrollForEmployee(employee, month, year, settings));
    }

    return res.status(200).json({
      success: true,
      payroll,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPayrollSettings = async (req, res) => {
  try {
    let settings = await PayrollSettings.findOne();

    if (!settings) {
      settings = await PayrollSettings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePayrollSettings = async (req, res) => {
  try {
    let settings = await PayrollSettings.findOne();

    if (!settings) {
      settings = await PayrollSettings.create(req.body);
    } else {
      settings = await PayrollSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Payroll settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = String(month || new Date().getMonth() + 1).padStart(2, "0");
    const targetYear = String(year || new Date().getFullYear());

    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const settings = (await PayrollSettings.findOne().lean()) || {};
    const payroll = await payrollForEmployee(employee, targetMonth, targetYear, settings);

    return res.status(200).json({
      success: true,
      payroll,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const requestLopRecovery = async (req, res) => {
  try {
    const { sourceMonth, sourceYear, reason = "" } = req.body;
    const employee = await Employee.findById(req.user._id);
    const settings = (await PayrollSettings.findOne().lean()) || {};
    const payroll = await payrollForEmployee(employee, sourceMonth, sourceYear, settings);

    if (!payroll.lopDeduction) {
      return res.status(400).json({
        success: false,
        message: "No LOP deduction found for the selected month",
      });
    }

    const apply = nextMonth(sourceMonth, sourceYear);
    const recovery = await LopRecovery.create({
      employee_id: employee._id,
      sourceMonth,
      sourceYear,
      applyMonth: apply.month,
      applyYear: apply.year,
      amount: payroll.lopDeduction,
      lopDays: payroll.lopDays,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "LOP salary recovery request submitted",
      recovery,
    });
  } catch (err) {
    const duplicate = err.code === 11000;
    return res.status(duplicate ? 409 : 500).json({
      success: false,
      message: duplicate ? "Recovery request already exists for this month" : err.message,
    });
  }
};

export const getPendingLopRecoveries = async (req, res) => {
  const recoveries = await LopRecovery.find({ status: "Pending" })
    .populate("employee_id", "name employee_id email")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({ success: true, recoveries });
};

export const lopRecoveryAction = async (req, res) => {
  const { recoveryId, action, adminRemarks = "" } = req.body;
  const recovery = await LopRecovery.findById(recoveryId);

  if (!recovery) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  recovery.status = action === "approve" ? "Approved" : "Rejected";
  recovery.adminRemarks = adminRemarks;
  await recovery.save();

  return res.status(200).json({
    success: true,
    message: `LOP recovery ${recovery.status.toLowerCase()}`,
    recovery,
  });
};
