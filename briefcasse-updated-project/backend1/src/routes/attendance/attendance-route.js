import express from "express";
import {
  punchIn,
  punchOut,
  getTodayAttendance,
  getAttendanceHistory,
  requestLeave,
  getMyLeaveRequests,
  requestAttendanceCorrection
} from "../../controllers/attendance/attendance-controller.js";
import { employeeProtectRoute,allowRoles } from "../../middleware/protectRoute.js";
import { wrapAsync } from "../../utils/wrapAsync.js";

const router = express.Router();

router.post("/punch-in", employeeProtectRoute, wrapAsync(punchIn));
router.post("/punch-out", employeeProtectRoute, wrapAsync(punchOut));
router.post("/request-leave", employeeProtectRoute, wrapAsync(requestLeave));
router.get("/today", employeeProtectRoute, wrapAsync(getTodayAttendance));
router.get("/history", employeeProtectRoute, wrapAsync(getAttendanceHistory));
router.get(
  "/my-leaves",
  employeeProtectRoute,
  allowRoles(["employee"]),
  wrapAsync(getMyLeaveRequests)
);
router.post(
  "/correction-request",
  employeeProtectRoute,
  wrapAsync(requestAttendanceCorrection)
);

export default router;