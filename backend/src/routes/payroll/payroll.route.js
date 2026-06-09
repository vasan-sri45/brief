import express from "express";
import { wrapAsync } from "../../utils/wrapAsync.js";
import {
  employeeProtectRoute,
  allowRoles,
} from "../../middleware/protectRoute.js";
import { getMonthlyPayroll, getMyPayroll, getPayrollSettings, getPendingLopRecoveries, lopRecoveryAction, requestLopRecovery, updatePayrollSettings, } from "../../controllers/payroll/payroll.controller.js";
const router = express.Router();

router.get(
  "/monthly",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getMonthlyPayroll)
);

router.get(
  "/me",
  employeeProtectRoute,
  allowRoles(["employee"]),
  wrapAsync(getMyPayroll)
);

router.post(
  "/lop-recovery",
  employeeProtectRoute,
  allowRoles(["employee"]),
  wrapAsync(requestLopRecovery)
);

router.get(
  "/lop-recovery/pending",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getPendingLopRecoveries)
);

router.put(
  "/lop-recovery/action",
  employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(lopRecoveryAction)
);

router.get(
  "/payroll/settings",
   employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(getPayrollSettings)
);

// UPDATE PAYROLL SETTINGS

router.put(
  "/payroll/settings",
   employeeProtectRoute,
  allowRoles(["admin"]),
  wrapAsync(updatePayrollSettings)
);

export default router;
