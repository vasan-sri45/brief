import crypto from "crypto";
import Payment from "../../models/services/pament.model.js";
import Service from "../../models/services/service.model.js";
import User from "../../models/auth/user.js";
import { razorpay } from "../../utils/razorpay.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const { slug } = req.body;

    const userId = req.user?.id;
    
    // 🔒 ALWAYS FETCH PRICE FROM DB
    const service = await Service.findOne({ slug });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const amount = Number(service.price) * 100; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await Payment.create({
      serviceId: service._id,
      userId,
      serviceSlug: slug,
      amount: service.price,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({
      orderId: order.id,
      amount: amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// export const getOrderDetails = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     if (!req.user?._id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const order = await Payment.findOne({
//       razorpayOrderId: orderId,
//       userId: req.user._id, // 🔒 owner check
//     }).populate("serviceId", "title price");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getAllOrders = async (req, res) => {
  try {
    if (!req.user?._id || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Payment.find()
      .populate("serviceId", "title price heading")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= UPDATE ORDER ================= */

export const updatePaymentService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      paymentStatus,
      serviceStatus,
      assignedTo,
      paymentMode,
    } = req.body;

    const updateData = {};

    if (paymentStatus !== undefined)
      updateData.status = paymentStatus; // Payment model uses "status"

    if (serviceStatus !== undefined)
      updateData.serviceStatus = serviceStatus;

    if (paymentMode !== undefined)
      updateData.paymentMode = paymentMode;

    if (assignedTo !== undefined)
      updateData.assignedTo = assignedTo || null;

    const updated = await Payment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("assignedTo", "name");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
