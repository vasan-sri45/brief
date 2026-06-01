import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllOrders,
  updatePaymentService,
  getMyOrders,
  softDeletePaymentService
} from "../../controllers/service/payment.controler.js";
import {userProtectRoute, employeeProtectRoute, allowRoles} from "../../middleware/protectRoute.js";

const router = express.Router();

router.post("/create-order",userProtectRoute, createOrder);
router.post("/verify",userProtectRoute, verifyPayment);
router.get("/my-orders", userProtectRoute, getMyOrders);
router.get(
  "/all-orders",
  employeeProtectRoute, 
  allowRoles(["admin", "employee"]),
  getAllOrders
);
router.put("/update/:id", employeeProtectRoute, allowRoles(["admin", "employee"]), updatePaymentService);
router.patch(
  "/soft-delete/:id",
  employeeProtectRoute,
  allowRoles(["admin", "employee"]),
  softDeletePaymentService
);


export default router;
