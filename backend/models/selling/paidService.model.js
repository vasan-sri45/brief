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
      userCode: {
        type: String,
        trim: true,
        uppercase: true,
        index: true,
      },
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, default: null },
    },

    serviceNo: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    serviceType: { type: String, required: true },
    serviceTitle: { type: String, trim: true, default: "" },
    serviceName: { type: String, trim: true, default: "" },
       service: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

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

    isDeleted: { type: Boolean, default: false },

    employeeHidden: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const staleCustomerUniqueFields = new Set([
  "name",
  "email",
  "mobile",
  "customer.name",
  "customer.email",
  "customer.mobile",
]);

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

const cleanupStalePaidServiceIndexes = async () => {
  try {
    const indexes = await PaidService.collection.indexes();
    const staleIndexes = indexes.filter((index) => {
      const keys = Object.keys(index.key || {});
      return (
        index.unique &&
        keys.length === 1 &&
        staleCustomerUniqueFields.has(keys[0])
      );
    });

    await Promise.all(
      staleIndexes.map((index) => PaidService.collection.dropIndex(index.name))
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Paid service index cleanup skipped:", error.message);
    }
  }
};

if (!globalThis.__paidServiceIndexCleanupScheduled) {
  globalThis.__paidServiceIndexCleanupScheduled = true;

  if (mongoose.connection.readyState === 1) {
    cleanupStalePaidServiceIndexes();
  } else {
    mongoose.connection.once("open", cleanupStalePaidServiceIndexes);
  }
}

export default PaidService;
