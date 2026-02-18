import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllOrders,
  updatePaymentService
} from "../../controllers/service/payment.controler.js";
import {userProtectRoute,adminAuth, employeeProtectRoute} from "../../middleware/protectRoute.js";

const router = express.Router();

router.post("/create-order",userProtectRoute, createOrder);
router.post("/verify",userProtectRoute, verifyPayment);
router.get(
  "/all-orders",
  employeeProtectRoute, adminAuth,    // 👈 admin middleware
  getAllOrders
);
router.put("/update/:id", employeeProtectRoute, updatePaymentService);


export default router;
