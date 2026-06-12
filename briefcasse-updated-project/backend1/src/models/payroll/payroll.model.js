import mongoose from "mongoose";

const payrollSettingsSchema = new mongoose.Schema(
  {
    providentFund: {
      type: Number,
      default: 0,
    },

    esi: {
      type: Number,
      default: 0,
    },

    professionalTax: {
      type: Number,
      default: 0,
    },

    tds: {
      type: Number,
      default: 0,
    },

    allowances: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PayrollSettings = mongoose.model(
  "PayrollSettings",
  payrollSettingsSchema
);

export default PayrollSettings;