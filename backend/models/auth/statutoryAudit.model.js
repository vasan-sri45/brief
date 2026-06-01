import mongoose from "mongoose";

const statutoryAuditSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    employeeCode: { type: String, required: true, trim: true },
    employeeName: { type: String, required: true, trim: true },
    field: {
      type: String,
      enum: ["UAN", "ESI"],
      required: true,
      index: true,
    },
    oldValue: { type: String, default: "", trim: true },
    newValue: { type: String, default: "", trim: true },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    updatedByName: { type: String, default: "", trim: true },
    reason: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const StatutoryAudit =
  mongoose.models.StatutoryAudit ||
  mongoose.model("StatutoryAudit", statutoryAuditSchema);

export default StatutoryAudit;
