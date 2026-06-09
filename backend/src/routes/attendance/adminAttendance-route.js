import express from "express";

import {
  adminAlterAttendance,
  getAdminTodayAttendance,
  getAdminMonthlyAttendance,
  getAdminPendingLeaves,
  adminLeaveAction,
  getAttendanceByDateRange,
  getPendingCorrections,
  adminCorrectionAction
} from "../../controllers/attendance/adminAttendance-controller.js";

import {
  employeeProtectRoute,
  allowRoles,
} from "../../middleware/protectRoute.js";

import { wrapAsync } from "../../utils/wrapAsync.js";

const router = express.Router();

// =======================================
// ADMIN TODAY ATTENDANCE DASHBOARD
// =======================================

router.get(
  "/attendance/today",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getAdminTodayAttendance)
);

// =======================================
// ADMIN MONTHLY ATTENDANCE
// =======================================

router.get(
  "/attendance/monthly",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getAdminMonthlyAttendance)
);

// =======================================
// ADMIN ALTER ATTENDANCE
// =======================================

router.put(
  "/attendance/alter",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(adminAlterAttendance)
);

router.get(
  "/leave/pending",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getAdminPendingLeaves)
);

router.put(
  "/leave/action",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(adminLeaveAction)
);

router.get(
  "/attendance/range",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getAttendanceByDateRange)
);

router.get(
  "/attendance/corrections",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getPendingCorrections)
);

router.put(
  "/attendance/correction-action",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(adminCorrectionAction)
);

export default router;