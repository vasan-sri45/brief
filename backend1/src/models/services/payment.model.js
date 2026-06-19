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
import Counter from "../selling/counter.model.js";

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

    serviceNo: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
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
      userCode: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      customerId: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

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

    baseAmount: {
      type: Number,
      default: 0,
    },

    gstRate: {
      type: Number,
      default: 18,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

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

    transactionStage: {
      type: String,
      enum: [
        "Just In",
        "Attempt to Contact",
        "Awaiting Document",
        "Document Preparation",
        "Final Draft",
        "Conclusion Stage",
        "Completed",
      ],
      default: "Just In",
    },

    transactionStages: {
      type: [
        {
          type: String,
          enum: [
            "Just In",
            "Attempt to Contact",
            "Awaiting Document",
            "Document Preparation",
            "Final Draft",
            "Conclusion Stage",
            "Completed",
          ],
        },
      ],
      default: ["Just In"],
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

    progressMessages: {
      type: [
        {
          message: { type: String, required: true, trim: true },
          createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    adminHidden: {
      type: Boolean,
      default: false,
      index: true,
    },

    employeeHidden: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  assignedTo: 1,
  serviceStatus: 1,
  employeeHidden: 1,
  createdAt: -1,
});

paymentSchema.index({
  status: 1,
  paymentMode: 1,
  createdAt: -1,
});

paymentSchema.index({
  serviceSlug: 1,
  createdAt: -1,
});

paymentSchema.index({
  "customer.email": 1,
  createdAt: -1,
});

paymentSchema.index({
  "customer.mobile": 1,
  createdAt: -1,
});

paymentSchema.index({
  "customer.customerId": 1,
  createdAt: -1,
});

paymentSchema.index({
  "customer.userCode": 1,
  createdAt: -1,
});

paymentSchema.pre("save", async function (next) {
  if (this.serviceNo) return next();

  const counter = await Counter.findOneAndUpdate(
    { _id: "onlineServiceNo" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.serviceNo = `BCAO${String(counter.seq).padStart(4, "0")}`;
  next();
});

const staleCustomerUniqueFields = new Set([
  "name",
  "email",
  "mobile",
  "customer.name",
  "customer.email",
  "customer.mobile",
]);

const cleanupStalePaymentIndexes = async () => {
  try {
    const indexes = await Payment.collection.indexes();
    const staleIndexes = indexes.filter((index) => {
      const keys = Object.keys(index.key || {});
      return (
        index.unique &&
        keys.length === 1 &&
        staleCustomerUniqueFields.has(keys[0])
      );
    });

    await Promise.all(
      staleIndexes.map((index) => Payment.collection.dropIndex(index.name))
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Payment index cleanup skipped:", error.message);
    }
  }
};

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

if (!globalThis.__paymentIndexCleanupScheduled) {
  globalThis.__paymentIndexCleanupScheduled = true;

  if (mongoose.connection.readyState === 1) {
    cleanupStalePaymentIndexes();
  } else {
    mongoose.connection.once("open", cleanupStalePaymentIndexes);
  }
}

export default Payment;
