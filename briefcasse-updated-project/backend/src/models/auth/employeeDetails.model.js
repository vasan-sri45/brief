import mongoose from "mongoose";

const personalDetailsSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
      unique: true,
      index: true,
    },

    fatherName: {
      type: String,
      default: "",
      trim: true,
    },

    motherName: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
      validate: {
        validator(value) {
          return !value || value <= new Date();
        },
        message: "Date of birth cannot be a future date.",
      },
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    panNo: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    accountNo: {
      type: String,
      default: "",
      trim: true,
    },

    ifscNo: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    bankName: {
      type: String,
      default: "",
      trim: true,
    },

    branchName: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalDetails = mongoose.model(
  "PersonalDetails",
  personalDetailsSchema
);

export default PersonalDetails;
