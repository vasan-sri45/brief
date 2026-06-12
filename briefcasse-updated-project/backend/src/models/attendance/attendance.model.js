// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema(
//   {
//     employee_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       required: true,
//       index: true,
//     },
//     dayKey: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     punchInTime: {
//       type: Date,
//       default: null,
//     },
//     punchOutTime: {
//       type: Date,
//       default: null,
//     },
//     totalMinutes: {
//       type: Number,
//       default: 0,
//     },
//     attendanceStatus: {
//       type: String,
//       enum: [
//         "Present",
//         "Half-Day",
//         "Absent",
//         "Sick Leave",
//         "Casual Leave",
//         "LOP",
//         "Emergency Leave",
//       ],
//       default: "Absent",
//     },
//     adminApproved: {
//       type: Boolean,
//       default: false,
//     },
//     remarks: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// attendanceSchema.index(
//   { employee_id: 1, dayKey: 1 },
//   { unique: true }
// );

// attendanceSchema.virtual("workingHours").get(function () {
//   const hours = Math.floor(this.totalMinutes / 60);
//   const minutes = this.totalMinutes % 60;
//   return `${hours}h ${minutes}m`;
// });

// export default mongoose.model("Attendance", attendanceSchema);


import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },

    dayKey: {
      type: String,
      required: true,
      index: true,
    },

    punchInTime: {
      type: Date,
      default: null,
    },

    punchOutTime: {
      type: Date,
      default: null,
    },

    totalMinutes: {
      type: Number,
      default: 0,
    },

    attendanceStatus: {
      type: String,

      enum: [
        "Present",
        "Late",
        "Half-Day",
        "Absent",
        "Sick Leave",
        "Casual Leave",
        "LOP",
        "Emergency Leave",
        "Holiday",
        "Weekend",
        "Pending Correction",
      ],

      default: "Absent",
    },

    adminApproved: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },

  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

attendanceSchema.index(
  {
    employee_id: 1,
    dayKey: 1,
  },

  {
    unique: true,
  }
);

attendanceSchema.index({
  employee_id: 1,
  dayKey: -1,
  attendanceStatus: 1,
});

attendanceSchema.index({
  dayKey: 1,
  attendanceStatus: 1,
});

attendanceSchema.virtual(
  "workingHours"
).get(function () {

  const hours = Math.floor(
    this.totalMinutes / 60
  );

  const minutes =
    this.totalMinutes % 60;

  return `${hours}h ${minutes}m`;
});

export default mongoose.model(
  "Attendance",
  attendanceSchema
);
