import mongoose from "mongoose";

const leaveRequestSchema =
  new mongoose.Schema(
    {
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
        index: true,
      },

      leaveType: {
        type: String,

        enum: [
          "Sick Leave",
          "Casual Leave",
          "Emergency Leave",
        ],

        required: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      totalDays: {
        type: Number,
        required: true,
      },

      remarks: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,

        enum: [
          "Pending",
          "Approved",
          "Rejected",
        ],

        default: "Pending",
      },

      adminRemarks: {
        type: String,
        default: "",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "LeaveRequest",
  leaveRequestSchema
);