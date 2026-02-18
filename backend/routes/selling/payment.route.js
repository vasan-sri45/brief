import express from "express";
import { createOrder } from "../../controllers/selling/payment.Controller.js";

const router = express.Router();

router.post("/create-order", createOrder);

export default router;
