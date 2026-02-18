import asyncHandler from 'express-async-handler';
import validator from 'validator';
import Employee from '../../models/auth/employee.js';
import generateToken from '../../utils/generateToken.js';
import User from '../../models/auth/user.js';
import { generateOtp, hashOtp } from "../../utils/otpGenerator.js";
import sendEmail from "../../utils/email.js";
import bcrypt from "bcryptjs";

export const register = asyncHandler(async (req, res) => {
  // Normalize inputs
  let { name, email, mobile, role, password } = req.body || {};
  name = typeof name === 'string' ? name.trim() : '';
  email = typeof email === 'string' ? email.trim().toLowerCase() : '';
  mobile = typeof mobile === 'string' ? mobile.trim() : '';
  role = typeof role === 'string' ? role.trim() : 'employee';

  // Required checks
  if (!name || !email || !mobile || !password) {
    res.status(400);
    throw new Error('Missing some credentials');
  }

  // Format validation
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Use locale as needed, e.g., en-IN, strictMode true for tighter match

  mobile = mobile.replace(/\D/g, '');
  const mobileValid = validator.isMobilePhone(
    mobile,
    'en-IN',
    { strictMode: false }
  );

  if (!mobileValid) {
    res.status(400);
    throw new Error('Please provide a valid mobile number');
  }

  // Duplicate checks (email/mobile unique)
  const [existingByEmail, existingByMobile] = await Promise.all([
    Employee.findOne({ email }).lean(),
    Employee.findOne({ mobile }).lean(),
  ]);
  if (existingByEmail || existingByMobile) {
    res.status(409);
    throw new Error('User already exists');
  }

  // Create and save
  try {
    const user = await Employee.create({ name, email, mobile, role, password });
    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    // Race-safe: catch unique index violations (E11000)
    if (err && err.code === 11000) {
      res.status(409);
      throw new Error('User already exists');
    }
    throw err;
  }
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
    user: { id: user._id, email: user.email, mobile: user.mobile, role: user.role },
  });
});


export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // If protect middleware already projects minimal fields, this is safe to send.
  // Otherwise, build a safe shape explicitly:
  const u = req.user;
  console.log(u);
  const safeUser = {
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    role: u.role,
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

  const filter = { role: 'employee' };
  const projection = '_id name email mobile role status createdAt';

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
