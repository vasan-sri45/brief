import mongoose from "mongoose";
import Counter from "./counter.model.js";

const paidServiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, default: null },
    },

    serviceNo: {
      type: String,
      unique: true,
      index: true,
    },

    serviceType: { type: String, required: true },
    service: { type: String, required: true },

    paymentMode: {
      type: String,
      enum: ["Online", "Cash", "UPI", "Card", "Bank Transfer"],
      required: true,
    },

    totalPayment: { type: Number, required: true },

    currency: { type: String, default: "INR" },

    transactionId: { type: String, default: null },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    serviceStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    notes: { type: String, default: "" },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paidServiceSchema.pre("save", async function (next) {
  if (this.serviceNo) return next();

  const counter = await Counter.findOneAndUpdate(
    { _id: "serviceNo" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  console.log("counter:", counter);
  this.serviceNo = `BCA${String(counter.seq).padStart(4, "0")}`;
  console.log("serviceNo:", this.serviceNo);
  next();
});


const PaidService =
  mongoose.models.PaidService ||
  mongoose.model("PaidService", paidServiceSchema);

export default PaidService;
