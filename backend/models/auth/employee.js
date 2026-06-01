import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Please enter a valid email address.",
      },
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      trim: true,
      validate: {
        validator: (v) =>
          validator.isMobilePhone(v, "any", { strictMode: false }),
        message: "Please enter a valid mobile number.",
      },
    },

    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    salaryPerMonth: {
      type: Number,
      default: 0,
      min: [0, "Salary cannot be negative"],
    },

    basicSalary: {
      type: Number,
      default: 0,
      min: [0, "Basic salary cannot be negative"],
    },

    hra: {
      type: Number,
      default: 0,
      min: [0, "HRA cannot be negative"],
    },

    conveyanceAllowance: {
      type: Number,
      default: 0,
      min: [0, "Conveyance allowance cannot be negative"],
    },

    medicalAllowance: {
      type: Number,
      default: 0,
      min: [0, "Medical allowance cannot be negative"],
    },

    specialAllowance: {
      type: Number,
      default: 0,
      min: [0, "Special allowance cannot be negative"],
    },

    annualCtc: {
      type: Number,
      default: 0,
      min: [0, "Annual CTC cannot be negative"],
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    dateOfJoining: {
      type: Date,
      default: null,
    },

    panNumber: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    hasExistingUan: {
      type: Boolean,
      default: false,
    },

    uanNumber: {
      type: String,
      default: "",
      trim: true,
    },

    hasExistingEsi: {
      type: Boolean,
      default: false,
    },

    esiNumber: {
      type: String,
      default: "",
      trim: true,
    },

    uanStatus: {
      type: String,
      enum: ["Not Available", "Available", "Pending", "Updated"],
      default: "Not Available",
    },

    esiStatus: {
      type: String,
      enum: ["Not Available", "Available", "Pending", "Updated"],
      default: "Not Available",
    },

    statutoryLastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    statutoryLastUpdatedAt: {
      type: Date,
      default: null,
    },

    bankAccountNumber: {
      type: String,
      default: "",
      trim: true,
    },

    ifscCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: ["on-role", "off-role"],
      default: "off-role",
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
    profileImage: {
      url: {
        type: String,
        default: "",
        trim: true
      },
      publicId: {
        type: String,
        default: "",
        trim: true
      },
      originalName: {
            type: String,
            default:"",
            trim: true,
          },
          mimetype: {
            type: String,
            default: "",
            trim: true,
          },
      },

    // ✅ Reset password token (NEW)
    resetToken: {
      type: String,
      select: false,
    },

    resetTokenExpiry: {
      type: Date,
      select: false,
    },

    forgotPasswordOTP: {
      type: String,
      select: false,
    },

    forgotPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

employeeSchema.index(
  { uanNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      uanNumber: { $type: "string", $ne: "" },
    },
  }
);

employeeSchema.index(
  { esiNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      esiNumber: { $type: "string", $ne: "" },
    },
  }
);

// 🔐 PASSWORD HASH
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔐 PASSWORD COMPARE
employeeSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// 🔐 HASH ON UPDATE
employeeSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  const pwd = update?.password ?? update?.$set?.password;
  if (!pwd) return next();

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(pwd, salt);

  if (update.$set?.password !== undefined) {
    update.$set.password = hashed;
  } else {
    update.password = hashed;
  }

  next();
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
