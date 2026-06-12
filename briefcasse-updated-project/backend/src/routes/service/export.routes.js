import express from "express";
import { exportTransactions } from "../../controllers/service/export.controller.js";
import {userProtectRoute,adminAuth, employeeProtectRoute,allowRoles} from "../../middleware/protectRoute.js";

const router = express.Router();

router.get("/export-transactions",employeeProtectRoute,allowRoles(['admin']), exportTransactions);

export default router;