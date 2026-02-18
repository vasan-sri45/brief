import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      name: { type: String, default: "" },
      mobile: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    serviceSlug: String,
    amount: Number,
    currency: { type: String, default: "INR" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
     serviceStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
        paymentMode: {
      type: String,
      enum: ["Online", "Cash", "UPI", "Card", "Bank Transfer"],
      default:"Online"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
