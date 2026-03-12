// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     serviceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Service",
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     customer: {
//       name: { type: String, default: "" },
//       mobile: { type: String, default: "" },
//       email: { type: String, default: "" },
//     },
//     serviceSlug: String,
//     amount: Number,
//     currency: { type: String, default: "INR" },
//     razorpayOrderId: String,
//     razorpayPaymentId: String,
//     razorpaySignature: String,
//     status: {
//       type: String,
//       enum: ["created", "paid", "failed"],
//       default: "created",
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//      serviceStatus: {
//       type: String,
//       enum: ["Pending", "In Progress", "Completed", "Cancelled"],
//       default: "Pending",
//     },
//         paymentMode: {
//       type: String,
//       enum: ["Online", "Cash", "UPI", "Card", "Bank Transfer"],
//       default:"Online"
//     },
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       default: null,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Payment", paymentSchema);


import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    /* ================= SERVICE INFO ================= */

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    serviceSlug: {
      type: String,
      required: true,
    },

    /* ================= USER INFO ================= */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= CUSTOMER DETAILS ================= */

    customer: {
      name: {
        type: String,
        default: "",
      },

      mobile: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },
    },

    /* ================= PAYMENT DETAILS ================= */

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMode: {
      type: String,
      enum: ["Online", "Cash", "UPI", "Card", "Bank Transfer"],
      default: "Online",
    },

    /* ================= RAZORPAY INFO ================= */

    razorpayOrderId: {
      type: String,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    /* ================= PAYMENT STATUS ================= */

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    /* ================= SERVICE WORKFLOW ================= */

    serviceStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    /* ================= EMPLOYEE MANAGEMENT ================= */

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

    /* ================= ADMIN NOTES ================= */

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);