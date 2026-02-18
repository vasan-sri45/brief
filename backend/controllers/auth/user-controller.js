// import asyncHandler from 'express-async-handler';
// import validator from 'validator';
// import User from '../../models/auth/user.js';
// import sendEmail from '../../utils/email.js';
// import bcrypt from 'bcryptjs';
// import {generateOtp, hashOtp} from '../../utils/otpGenerator.js';
// import generateToken from '../../utils/generateToken.js';
// import { getAuthCookieName, getAuthCookieOptions } from '../../utils/auth/cookies.js';

// export const register = asyncHandler(async (req, res) => {
//   let {
//     name,
//     email,
//     mobile,
//     accountType,
//     businessName = req.body.businessName ?? req.body.bussinessName,
//     businessType = req.body.businessType ?? req.body.bussinessType,
//   } = req.body || {};

//   name = typeof name === "string" ? name.trim() : "";
//   email = typeof email === "string" ? email.trim().toLowerCase() : "";
//   mobile = typeof mobile === "string" ? mobile.trim() : "";

//   if (!name || !email || !mobile) {
//     res.status(400);
//     throw new Error("Missing some credentials");
//   }

//   if (!validator.isEmail(email)) {
//     res.status(400);
//     throw new Error("Please provide a valid email address");
//   }
//   if (!validator.isMobilePhone(mobile, "any", { strictMode: false })) {
//     res.status(400);
//     throw new Error("Please provide a valid mobile number");
//   }

//   if (accountType === "business") {
//     if (!businessName || !businessType) {
//       res.status(400);
//       throw new Error(
//         "Business name and type are required for business accounts"
//       );
//     }
//   }

//   const [existingByEmail, existingByMobile] = await Promise.all([
//     User.findOne({ email }).lean(),
//     User.findOne({ mobile }).lean(),
//   ]);
//   if (existingByEmail || existingByMobile) {
//     res.status(409);
//     throw new Error("User already exists");
//   }

//   try {
//     const user = await User.create({
//       name,
//       email,
//       mobile,
//       accountType,
//       businessName,
//       businessType,
//     });

//     // ---- OTP generate + save ----
//     const otp = generateOtp();
//     const hashedOtp = await hashOtp(otp);
//     const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);
//     const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

//     user.otp = hashedOtp;
//     user.otpExpires = otpExpires;
//     await user.save({ validateBeforeSave: false });

//     const message = `Your One-Time Password (OTP) for verification is: ${otp}. This OTP is valid for ${expiryMinutes} minutes. Please do not share it with anyone.`;

//     await sendEmail({
//       email: user.email,
//       subject: "Your OTP for Registration",
//       message,
//       html: `<p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>.</p><p>This OTP is valid for ${expiryMinutes} minutes.</p><p>Please do not share it with anyone.</p>`,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "User registered. OTP sent to your email.",
//       email: user.email,
//     });
//   } catch (err) {
//     if (err && err.code === 11000) {
//       res.status(409);
//       throw new Error("User already exists");
//     }
//     throw err;
//   }
// });


// export const sendOtp = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     res.status(400);
//     throw new Error("Please provide a valid email address");
//   }

//   const user = await User.findOne({ email });

//   if (!user) {
//     // enumeration தவிர்க்க generic success
//     return res.status(200).json({
//       status: "success",
//       message: "If an account with that email exists, an OTP has been sent.",
//     });
//   }

//   const otp = generateOtp();
//   const hashedOtp = await hashOtp(otp);
//   const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);
//   const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

//   user.otp = hashedOtp;
//   user.otpExpires = otpExpires;
//   await user.save({ validateBeforeSave: false });

//   const message = `Your One-Time Password (OTP) for verification is: ${otp}. This OTP is valid for ${expiryMinutes} minutes. Please do not share it with anyone.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your OTP for Verification",
//       message,
//       html: `<p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>.</p><p>This OTP is valid for ${expiryMinutes} minutes.</p><p>Please do not share it with anyone.</p>`,
//     });

//     return res.status(200).json({
//       status: "success",
//       message: "OTP sent to your email successfully!",
//     });
//   } catch (error) {
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     console.error("Error sending OTP email:", error);
//     res.status(500);
//     throw new Error(error.message || "Failed to send OTP email");
//   }
// });

// export const verifyOtp = asyncHandler(async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     res.status(400);
//     throw new Error('Missing credentials.');
//   }

//   const user = await User.findOne({ email }).select('+otp +otpExpires');

//   if (!user) {
//     res.status(400);
//     throw new Error('Invalid email or OTP.');
//   }

//   if (!user.otpExpires || user.otpExpires < Date.now()) {
//     res.status(400);
//     throw new Error('OTP has expired. Please request a new one.');
//   }

//   // *** This is CRITICAL ***
//   const isMatch = await bcrypt.compare(otp, user.otp);

//   if (!isMatch) {
//     res.status(400);
//     throw new Error('Invalid otp.');
//   }

//   // OTP is valid - clear and verify only now!
//   user.otp = undefined;
//   user.otpExpires = undefined;
//   await user.save({ validateBeforeSave: false });

//   const token = generateToken(user._id, res);

//   return res.status(200).json({
//     success: true,
//     message: "OTP verified successfully!",
//     token,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile,
//       accountType: user.accountType,
//       role:user.role
//     },
//   });
// });


// export const getMe = asyncHandler(async(req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });

// export const logout = asyncHandler(async (req, res) => {
//   const name = getAuthCookieName();
//   const opts = getAuthCookieOptions();

//   // Important: pass the same options as when setting the cookie (excluding expires/maxAge)
//   res.clearCookie(name, opts);

//   return res.status(200).json({
//     success: true,
//     message: 'Logged out successfully',
//   });
// });




import asyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcryptjs";

import User from "../../models/auth/user.js";
import sendEmail from "../../utils/email.js";
import { generateOtp, hashOtp } from "../../utils/otpGenerator.js";
import generateToken from "../../utils/generateToken.js";
import { getAuthCookieName, getAuthCookieOptions } from "../../utils/auth/cookies.js";

export const register = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    mobile,
    accountType,
    businessName = req.body.businessName ?? req.body.bussinessName,
    businessType = req.body.businessType ?? req.body.bussinessType,
  } = req.body || {};

  name = typeof name === "string" ? name.trim() : "";
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  mobile = typeof mobile === "string" ? mobile.trim() : "";

  if (!name || !email || !mobile) {
    res.status(400);
    throw new Error("Missing some credentials");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  if (!validator.isMobilePhone(mobile, "any", { strictMode: false })) {
    res.status(400);
    throw new Error("Please provide a valid mobile number");
  }

  if (accountType === "business") {
    if (!businessName || !businessType) {
      res.status(400);
      throw new Error("Business name and type are required for business accounts");
    }
  }

  const [existingByEmail, existingByMobile] = await Promise.all([
    User.findOne({ email }).lean(),
    User.findOne({ mobile }).lean(),
  ]);

  if (existingByEmail || existingByMobile) {
    res.status(409);
    throw new Error("User already exists");
  }

  try {
    const user = await User.create({
      name,
      email,
      mobile,
      accountType,
      businessName,
      businessType,
    });

    // ---- OTP generate + save ----
    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);
    const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    const message = `Your One-Time Password (OTP) for verification is: ${otp}. This OTP is valid for ${expiryMinutes} minutes. Please do not share it with anyone.`;

    await sendEmail({
      email: user.email,
      subject: "Your OTP for Registration",
      // ✅ use text OR message (both supported)
      text: message,
      html: `<p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>.</p>
             <p>This OTP is valid for ${expiryMinutes} minutes.</p>
             <p>Please do not share it with anyone.</p>`,
    });

    return res.status(201).json({
      success: true,
      message: "User registered. OTP sent to your email.",
      email: user.email,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      res.status(409);
      throw new Error("User already exists");
    }
    throw err;
  }
});

export const sendOtp = asyncHandler(async (req, res) => {
  // ✅ normalize email
  const email = (req.body.email || "").trim().toLowerCase();

  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findOne({ email });

  // enumeration avoid – generic success
  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "If an account with that email exists, an OTP has been sent.",
    });
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);
  const otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

  user.otp = hashedOtp;
  user.otpExpires = otpExpires;
  await user.save({ validateBeforeSave: false });

  const message = `Your One-Time Password (OTP) for verification is: ${otp}. This OTP is valid for ${expiryMinutes} minutes. Please do not share it with anyone.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your OTP for Verification",
      text: message,
      html: `<p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>.</p>
             <p>This OTP is valid for ${expiryMinutes} minutes.</p>
             <p>Please do not share it with anyone.</p>`,
    });

    return res.status(200).json({
      status: "success",
      message: "OTP sent to your email successfully!",
    });
  } catch (error) {
    // clear otp if email sending fails
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Error sending OTP email:", error);
    res.status(500);
    throw new Error(error.message || "Failed to send OTP email");
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const otp = (req.body.otp || "").trim();

  if (!email || !otp) {
    res.status(400);
    throw new Error("Missing credentials.");
  }

  const user = await User.findOne({ email }).select("+otp +otpExpires");

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or OTP.");
  }

  if (!user.otpExpires || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  // compare plain otp with hashed otp
  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid otp.");
  }

  // clear otp
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, res);

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully!",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      accountType: user.accountType,
      role: user.role,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const name = getAuthCookieName();
  const opts = getAuthCookieOptions();

  res.clearCookie(name, opts);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
