import mongoose from "mongoose";

const attendanceCorrectionSchema =
  new mongoose.Schema(
    {
      employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },

      attendance_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
        required: true,
      },

      correctionType: {
        type: String,

        enum: [
          "Missing Punch In",
          "Missing Punch Out",
          "Missing Both",
        ],

        required: true,
      },

      requestedPunchInTime: {
        type: Date,
        default: null,
      },

      requestedPunchOutTime: {
        type: Date,
        default: null,
      },

      reason: {
        type: String,
        required: true,
        trim: true,
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
  "AttendanceCorrection",
  attendanceCorrectionSchema
);
