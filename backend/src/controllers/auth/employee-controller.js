import asyncHandler from 'express-async-handler';
import validator from 'validator';
import Employee from '../../models/auth/employee.js';
import {generateToken} from '../../utils/generateToken.js';
import User from '../../models/auth/user.js';
import { generateOtp, hashOtp } from "../../utils/otpGenerator.js";
import sendEmail from "../../utils/email.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { uploadToCloudinary, cloudinary } from '../../helpers/cloudinary.js';
import streamifier from "streamifier";
import Counter from "../../models/auth/counter.js"
import StatutoryAudit from "../../models/auth/statutoryAudit.model.js";

const UAN_PATTERN = /^\d{12}$/;
const ESI_PATTERN = /^\d+$/;

const normalizeUan = (value) =>
  typeof value === "string" ? value.trim() : "";
const normalizeEsi = (value) =>
  typeof value === "string" ? value.trim() : "";

const parsePastDate = (value, fieldLabel) => {
  if (value === undefined || value === null || value === "") return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`${fieldLabel} is invalid`);
    error.statusCode = 400;
    throw error;
  }

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (parsed > endOfToday) {
    const error = new Error(`${fieldLabel} cannot be a future date`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

const validateUanRules = async ({
  uanNumber,
  employeeId,
  employmentType,
  basicSalary,
  salaryPerMonth,
}) => {
  const uan = normalizeUan(uanNumber);

  if (uan && !UAN_PATTERN.test(uan)) {
    const error = new Error("UAN number must be a 12-digit numeric value");
    error.statusCode = 400;
    throw error;
  }

  if (uan) {
    const duplicate = await Employee.findOne({
      uanNumber: uan,
      ...(employeeId ? { _id: { $ne: employeeId } } : {}),
    }).lean();

    if (duplicate) {
      const error = new Error("UAN number already exists for another employee");
      error.statusCode = 409;
      throw error;
    }
  }

  return uan;
};

const validateEsiRules = async ({ esiNumber, employeeId }) => {
  const esi = normalizeEsi(esiNumber);

  if (esi && !ESI_PATTERN.test(esi)) {
    const error = new Error("ESI number must contain only digits");
    error.statusCode = 400;
    throw error;
  }

  if (esi) {
    const duplicate = await Employee.findOne({
      esiNumber: esi,
      ...(employeeId ? { _id: { $ne: employeeId } } : {}),
    }).lean();

    if (duplicate) {
      const error = new Error("ESI number already exists for another employee");
      error.statusCode = 409;
      throw error;
    }
  }

  return esi;
};

// 🔥 Generate Employee ID (SAFE)
const getNextEmployeeId = async () => {
  const legacyCounter = await Counter.findOne({ name: "employee_id" }).lean();

  await Counter.updateOne(
    { _id: "employee_id" },
    {
      $setOnInsert: {
        name: "employee_id",
        seq: Number(legacyCounter?.seq || 0),
      },
    },
    { upsert: true }
  );

  const counter = await Counter.findOneAndUpdate(
    { _id: "employee_id" },
    { $inc: { seq: 1 } },
    { new: true }
  );

  return `EMP${String(counter.seq).padStart(4, "0")}`;
};

export const register = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    mobile,
    role,
    password,
    salaryPerMonth,
    basicSalary,
    hra,
    conveyanceAllowance,
    medicalAllowance,
    specialAllowance,
    annualCtc,
    department,
    designation,
    dateOfJoining,
    dateOfBirth,
    panNumber,
    hasExistingUan,
    uanNumber,
    hasExistingEsi,
    esiNumber,
    bankAccountNumber,
    ifscCode,
    employmentType,
  } = req.body || {};

  name = typeof name === "string" ? name.trim() : "";
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  mobile = typeof mobile === "string" ? mobile.trim() : "";
  role = typeof role === "string" ? role.trim() : "employee";
  department = typeof department === "string" ? department.trim() : "";
  designation = typeof designation === "string" ? designation.trim() : "";
  panNumber = typeof panNumber === "string" ? panNumber.trim().toUpperCase() : "";
  hasExistingUan = hasExistingUan === true || hasExistingUan === "true";
  uanNumber = typeof uanNumber === "string" ? uanNumber.trim() : "";
  hasExistingEsi = hasExistingEsi === true || hasExistingEsi === "true";
  esiNumber = typeof esiNumber === "string" ? esiNumber.trim() : "";
  bankAccountNumber =
    typeof bankAccountNumber === "string" ? bankAccountNumber.trim() : "";
  ifscCode = typeof ifscCode === "string" ? ifscCode.trim().toUpperCase() : "";
  employmentType = employmentType === "on-role" ? "on-role" : "off-role";
  salaryPerMonth = Number(salaryPerMonth || 0);
  basicSalary = Number(basicSalary || 0);
  hra = Number(hra || 0);
  conveyanceAllowance = Number(conveyanceAllowance || 0);
  medicalAllowance = Number(medicalAllowance || 0);
  specialAllowance = Number(specialAllowance || 0);
  annualCtc = Number(annualCtc || 0);

  const componentGross =
    basicSalary + hra + conveyanceAllowance + medicalAllowance + specialAllowance;

  if (!salaryPerMonth && componentGross) {
    salaryPerMonth = componentGross;
  }

  if (!annualCtc && salaryPerMonth) {
    annualCtc = salaryPerMonth * 12;
  }

  // ✅ VALIDATION
  if (!name || !email || !mobile || !password) {
    res.status(400);
    throw new Error("Missing some credentials");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  mobile = mobile.replace(/\D/g, "");
  if (!validator.isMobilePhone(mobile, "en-IN")) {
    res.status(400);
    throw new Error("Please provide a valid mobile number");
  }

  // ✅ DUPLICATE CHECK
  const [existingByEmail, existingByMobile] = await Promise.all([
    Employee.findOne({ email }).lean(),
    Employee.findOne({ mobile }).lean(),
  ]);

  if (existingByEmail || existingByMobile) {
    res.status(409);
    throw new Error("User already exists");
  }

  uanNumber = await validateUanRules({
    uanNumber,
    employmentType,
    basicSalary,
    salaryPerMonth,
  });
  esiNumber = await validateEsiRules({ esiNumber });

  try {
    // ✅ GENERATE EMPLOYEE ID
    const employee_id = await getNextEmployeeId();

    // ✅ CREATE USER
    const user = await Employee.create({
      employee_id,
      name,
      email,
      mobile,
      role,
      password,
      salaryPerMonth,
      basicSalary,
      hra,
      conveyanceAllowance,
      medicalAllowance,
      specialAllowance,
      annualCtc,
      department,
      designation,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
      dateOfBirth: parsePastDate(dateOfBirth, "Date of birth"),
      panNumber,
      hasExistingUan,
      uanNumber,
      hasExistingEsi,
      esiNumber,
      uanStatus: uanNumber ? "Available" : "Not Available",
      esiStatus: esiNumber ? "Available" : "Not Available",
      bankAccountNumber,
      ifscCode,
      employmentType,
    });

    // ✅ GENERATE TOKEN
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // ✅ EMAIL LINK
    const resetUrl = `http://localhost:3000/forgot_password/${token}`;

    await sendEmail({
      email: user.email,
      subject: "Set Your Password - BriefCasse",
      html: `
        <h2>Welcome to BriefCasse 🎉</h2>
        <p>Your account has been created.</p>

        <p><strong>Employee ID:</strong> ${user.employee_id}</p>

        <p>Click below to set your password:</p>
        <a href="${resetUrl}" style="color:blue;font-weight:bold">
          Set Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created & email sent",
      user: {
        id: user._id,
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        salaryPerMonth: user.salaryPerMonth,
        basicSalary: user.basicSalary,
        hra: user.hra,
        conveyanceAllowance: user.conveyanceAllowance,
        medicalAllowance: user.medicalAllowance,
        specialAllowance: user.specialAllowance,
        annualCtc: user.annualCtc,
        department: user.department,
        designation: user.designation,
        dateOfJoining: user.dateOfJoining,
        dateOfBirth: user.dateOfBirth,
        panNumber: user.panNumber,
        hasExistingUan: user.hasExistingUan,
        uanNumber: user.uanNumber,
        hasExistingEsi: user.hasExistingEsi,
        esiNumber: user.esiNumber,
        uanStatus: user.uanStatus,
        esiStatus: user.esiStatus,
        bankAccountNumber: user.bankAccountNumber,
        ifscCode: user.ifscCode,
        employmentType: user.employmentType,
      },
    });

  } catch (err) {
    if (err.code === 11000) {
      res.status(409);
      throw new Error("User already exists");
    }
    throw err;
  }
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    "name",
    "email",
    "mobile",
    "role",
    "status",
    "salaryPerMonth",
    "basicSalary",
    "hra",
    "conveyanceAllowance",
    "medicalAllowance",
    "specialAllowance",
    "annualCtc",
    "department",
    "designation",
    "dateOfJoining",
    "dateOfBirth",
    "panNumber",
    "hasExistingUan",
    "uanNumber",
    "hasExistingEsi",
    "esiNumber",
    "bankAccountNumber",
    "ifscCode",
    "employmentType",
  ];

  const update = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      update[field] = req.body[field];
    }
  });

  const existingEmployee = await Employee.findById(id).lean();

  if (!existingEmployee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  ["email", "department", "designation", "panNumber", "ifscCode"].forEach(
    (field) => {
      if (typeof update[field] === "string") update[field] = update[field].trim();
    }
  );

  if (typeof update.email === "string") {
    update.email = update.email.toLowerCase();
    if (!validator.isEmail(update.email)) {
      res.status(400);
      throw new Error("Please provide a valid email address");
    }
  }

  if (typeof update.mobile === "string") {
    update.mobile = update.mobile.replace(/\D/g, "");
    if (!validator.isMobilePhone(update.mobile, "en-IN")) {
      res.status(400);
      throw new Error("Please provide a valid mobile number");
    }
  }

  [
    "salaryPerMonth",
    "basicSalary",
    "hra",
    "conveyanceAllowance",
    "medicalAllowance",
    "specialAllowance",
    "annualCtc",
  ].forEach((field) => {
    if (update[field] !== undefined) update[field] = Number(update[field] || 0);
  });

  const componentGross =
    Number(update.basicSalary || 0) +
    Number(update.hra || 0) +
    Number(update.conveyanceAllowance || 0) +
    Number(update.medicalAllowance || 0) +
    Number(update.specialAllowance || 0);

  if (componentGross && req.body.salaryPerMonth === undefined) {
    update.salaryPerMonth = componentGross;
  }

  if (update.salaryPerMonth && req.body.annualCtc === undefined) {
    update.annualCtc = Number(update.salaryPerMonth) * 12;
  }

  if (update.dateOfJoining) {
    update.dateOfJoining = new Date(update.dateOfJoining);
  }

  if (update.dateOfBirth !== undefined) {
    update.dateOfBirth = parsePastDate(update.dateOfBirth, "Date of birth");
  }

  if (update.employmentType) {
    update.employmentType =
      update.employmentType === "on-role" ? "on-role" : "off-role";
  }

  const nextEmploymentType =
    update.employmentType || existingEmployee.employmentType || "off-role";
  const nextBasicSalary =
    update.basicSalary !== undefined
      ? update.basicSalary
      : existingEmployee.basicSalary;
  const nextSalaryPerMonth =
    update.salaryPerMonth !== undefined
      ? update.salaryPerMonth
      : existingEmployee.salaryPerMonth;
  const nextUan =
    update.uanNumber !== undefined
      ? normalizeUan(update.uanNumber)
      : existingEmployee.uanNumber || "";
  const oldUan = existingEmployee.uanNumber || "";
  const uanChanged = nextUan !== oldUan;
  const oldEsi = existingEmployee.esiNumber || "";
  const nextEsi =
    update.esiNumber !== undefined
      ? normalizeEsi(update.esiNumber)
      : existingEmployee.esiNumber || "";
  const esiChanged = nextEsi !== oldEsi;

  update.uanNumber = await validateUanRules({
    uanNumber: nextUan,
    employeeId: id,
    employmentType: nextEmploymentType,
    basicSalary: nextBasicSalary,
    salaryPerMonth: nextSalaryPerMonth,
  });
  update.esiNumber = await validateEsiRules({
    esiNumber: nextEsi,
    employeeId: id,
  });

  if (update.hasExistingUan !== undefined) {
    update.hasExistingUan =
      update.hasExistingUan === true || update.hasExistingUan === "true";
  }

  if (update.hasExistingEsi !== undefined) {
    update.hasExistingEsi =
      update.hasExistingEsi === true || update.hasExistingEsi === "true";
  }

  if (uanChanged) {
    update.uanStatus = update.uanNumber ? "Updated" : "Not Available";
  }

  if (esiChanged) {
    update.esiStatus = update.esiNumber ? "Updated" : "Not Available";
  }

  if (uanChanged || esiChanged) {
    update.statutoryLastUpdatedBy = req.user._id;
    update.statutoryLastUpdatedAt = new Date();
  }

  if (uanChanged && !String(req.body.uanChangeReason || "").trim()) {
    res.status(400);
    throw new Error("Reason for UAN change is required");
  }

  if (esiChanged && !String(req.body.esiChangeReason || "").trim()) {
    res.status(400);
    throw new Error("Reason for ESI change is required");
  }

  const employee = await Employee.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  if (uanChanged) {
    await StatutoryAudit.create({
      employee: employee._id,
      employeeCode: employee.employee_id,
      employeeName: employee.name,
      field: "UAN",
      oldValue: oldUan,
      newValue: employee.uanNumber || "",
      updatedBy: req.user._id,
      updatedByName: req.user.name || req.user.email || "Admin",
      reason: String(req.body.uanChangeReason || "").trim(),
    });
  }

  if (esiChanged) {
    await StatutoryAudit.create({
      employee: employee._id,
      employeeCode: employee.employee_id,
      employeeName: employee.name,
      field: "ESI",
      oldValue: oldEsi,
      newValue: employee.esiNumber || "",
      updatedBy: req.user._id,
      updatedByName: req.user.name || req.user.email || "Admin",
      reason: String(req.body.esiChangeReason || "").trim(),
    });
  }

  return res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    user: employee,
  });
});


export const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body || {};
  email = typeof email === 'string' ? email.trim().toLowerCase() : '';
  password = typeof password === 'string' ? password : '';

  if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }

  if (!validator.isEmail(email)) { res.status(400); throw new Error('Please provide a valid email address'); }

  const user = await Employee.findOne({ email }).select('+password +role');
  if (!user) { res.status(401); throw new Error('Invalid credentials'); }

  const ok = await user.comparePassword(password, user.password);
  if (!ok) { res.status(401); throw new Error('Invalid credentials'); }

  // Set HttpOnly cookie
  const token = generateToken(user._id, res); // update util to return the token string
  // return token in body too
  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    token, // <= add this
    user: { id: user._id, email: user.email, mobile: user.mobile, role: user.role,profileImage: user.profileImage },
  });
});


export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // If protect middleware already projects minimal fields, this is safe to send.
  // Otherwise, build a safe shape explicitly:
  const u = req.user;
  const safeUser = {
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    role: u.role,
    employee_id: u.employee_id,
    department: u.department,
    designation: u.designation,
    dateOfJoining: u.dateOfJoining,
    dateOfBirth: u.dateOfBirth,
    profileImage: u.profileImage
  };

  return res.status(200).json({
    success: true,
    message: 'Authenticated user!',
    user: safeUser,
  });
});

export const getEmployees = asyncHandler(async (req, res) => {
  // Parse pagination/sorting with sane defaults and caps
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const sort = (req.query.sort === 'asc' ? 1 : -1); // default desc
  const skip = (page - 1) * limit;
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const status = typeof req.query.status === "string" ? req.query.status.trim() : "";

  const filter = { role: 'employee' };

  if (status && status !== "All") {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { employee_id: { $regex: search, $options: "i" } },
    ];
  }

  const projection =
    "_id employee_id name email mobile role status salaryPerMonth basicSalary hra conveyanceAllowance medicalAllowance specialAllowance annualCtc department designation dateOfJoining dateOfBirth panNumber hasExistingUan uanNumber hasExistingEsi esiNumber uanStatus esiStatus statutoryLastUpdatedBy statutoryLastUpdatedAt bankAccountNumber ifscCode employmentType createdAt";

  // Run count and page query in parallel
  const [total, users] = await Promise.all([
    Employee.countDocuments(filter),
    Employee.find(filter)
      .select(projection)
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return res.status(200).json({
    success: true,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    },
    users
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const sortDir = req.query.sort === 'asc' ? 1 : -1; // default desc
  const skip = (page - 1) * limit;

  // Optional filters (extend as needed)
  const filter = {}; // e.g., { role: req.query.role } if role filtering is needed

  // Project only fields required by the UI
  const projection = '_id name email mobile role status createdAt';

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select(projection)
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  return res.status(200).json({
    success: true,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    },
    users
  });
});

export const sendForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // IMPORTANT: select hidden fields
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    // ✅ MATCH SCHEMA
    user.forgotPasswordOTP = hashedOtp;
    user.forgotPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      html: `
        <p>Your OTP for password reset:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to registered email",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await Employee.findOne({ email }).select(
      "+forgotPasswordOTP +forgotPasswordExpires"
    );

    if (
      !user ||
      !user.forgotPasswordOTP ||
      user.forgotPasswordExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    const isValidOtp = await bcrypt.compare(
      otp,
      user.forgotPasswordOTP
    );

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await Employee.findOne({ email }).select(
      "+forgotPasswordOTP +forgotPasswordExpires +password"
    );

    if (
      !user ||
      !user.forgotPasswordOTP ||
      user.forgotPasswordExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    const isValidOtp = await bcrypt.compare(
      otp,
      user.forgotPasswordOTP
    );

    if (!isValidOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.password = newPassword;
    user.forgotPasswordOTP = undefined;
    user.forgotPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const user = await Employee.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ DELETE OLD IMAGE
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    // ✅ UPLOAD USING HELPER
    const uploaded = await uploadToCloudinary(req.file.buffer, {
      folder: "employees/profile",
    });

    // ✅ SAVE TO DB
    user.profileImage = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated",
      profileImage: user.profileImage,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
