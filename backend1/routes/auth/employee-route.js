// backend/routes/auth/employee-route.js
import express from "express";
import { getMe, login, register, getEmployees, getUsers, sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPasswordWithOtp} from "../../controllers/auth/employee-controller.js";
import { employeeProtectRoute, adminAuth, allowEmployeesAndAdmins } from "../../middleware/protectRoute.js";
import { wrapAsync } from "../../utils/wrapAsync.js";

const router = express.Router();

router.post("/employee", wrapAsync(register));
router.post("/employee/login", wrapAsync(login));
router.get("/employee", employeeProtectRoute, wrapAsync(getMe));
router.get("/employee/get", employeeProtectRoute, adminAuth, wrapAsync(getEmployees));
router.get("/employee/getUsers", employeeProtectRoute, allowEmployeesAndAdmins, wrapAsync(getUsers));
router.post("/forgot-password", wrapAsync(sendForgotPasswordOtp));
router.post("/verify-forgot-otp", wrapAsync(verifyForgotPasswordOtp));
router.post("/reset-password", wrapAsync(resetPasswordWithOtp));


export default router;
