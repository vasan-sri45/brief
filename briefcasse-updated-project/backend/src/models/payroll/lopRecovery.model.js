import mongoose from "mongoose";

const lopRecoverySchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    sourceMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    sourceYear: {
      type: Number,
      required: true,
    },
    applyMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    applyYear: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    lopDays: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

lopRecoverySchema.index(
  { employee_id: 1, sourceMonth: 1, sourceYear: 1, applyMonth: 1, applyYear: 1 },
  { unique: true }
);

lopRecoverySchema.index({
  employee_id: 1,
  applyMonth: 1,
  applyYear: 1,
  status: 1,
});

lopRecoverySchema.index({
  status: 1,
  createdAt: -1,
});

export default mongoose.models.LopRecovery ||
  mongoose.model("LopRecovery", lopRecoverySchema);
