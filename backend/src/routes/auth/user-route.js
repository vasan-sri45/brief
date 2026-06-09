import express from 'express';
import {getMe, logout, register, sendOtp, verifyOtp} from '../../controllers/auth/user-controller.js';
import {userProtectRoute} from '../../middleware/protectRoute.js';
import {wrapAsync} from '../../utils/wrapAsync.js';


const router = express.Router();

router.post('/create', wrapAsync(register));
// router.post('/employee', employeeRegister)
router.post('/send-otp', wrapAsync(sendOtp));
router.post('/verify-otp', wrapAsync(verifyOtp));
router.get('/user', userProtectRoute, wrapAsync(getMe));
router.post('/logout', wrapAsync(logout));

export default router;

