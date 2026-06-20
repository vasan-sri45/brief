import asyncHandler from "express-async-handler";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../../models/auth/user.js";
import Counter from "../../models/auth/counter.js";
import sendEmail from "../../utils/email.js";
import { generateOtp, hashOtp } from "../../utils/otpGenerator.js";
import { generateToken } from "../../utils/generateToken.js";
import { getAuthCookieName, getAuthCookieOptions } from "../../utils/auth/cookies.js";

const getNextCustomerId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "customer_id" },
    { $setOnInsert: { name: "customer_id" }, $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `CUS${String(counter.seq).padStart(5, "0")}`;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const buildLoginSuccessEmail = (user) => {
  const customerName = user.name || "Customer";
  const loginTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8fc;padding:24px;color:#172033">
      <div style="max-width:640px;margin:auto;background:#ffffff;border:1px solid #dce7ff;border-radius:18px;overflow:hidden">
        <div style="background:#3158df;color:#ffffff;padding:24px">
          <h1 style="margin:0;font-size:24px">Login successful</h1>
          <p style="margin:8px 0 0">Welcome back to Briefcasse.</p>
        </div>
        <div style="padding:24px;line-height:1.7">
          <p style="margin-top:0">Hi <strong>${escapeHtml(customerName)}</strong>,</p>
          <p>Thank you for logging in to your Briefcasse account.</p>
          <p>Your customer dashboard is ready with service updates, invoices, and support ticket information.</p>
          <table style="width:100%;border-collapse:collapse;margin:18px 0">
            <tr>
              <td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Email ID</td>
              <td style="padding:10px;border-bottom:1px solid #edf2ff;font-weight:700">${escapeHtml(user.email)}</td>
            </tr>
            <tr>
              <td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Customer ID</td>
              <td style="padding:10px;border-bottom:1px solid #edf2ff;font-weight:700">${escapeHtml(user.customerId || "-")}</td>
            </tr>
            <tr>
              <td style="padding:10px;color:#64748b">Login Time</td>
              <td style="padding:10px;font-weight:700">${escapeHtml(loginTime)}</td>
            </tr>
          </table>
          <p>If this login was not done by you, please contact Briefcasse support immediately.</p>
          <p style="margin-bottom:0">Regards,<br/><strong>Team Briefcasse</strong></p>
        </div>
      </div>
    </div>
  `;
};

const sendRegistrationOtp = async (user) => {
  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);

  user.otp = hashedOtp;
  user.otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const message = `Your One-Time Password (OTP) for verification is: ${otp}. This OTP is valid for ${expiryMinutes} minutes. Please do not share it with anyone.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your OTP for Registration",
      text: message,
      html: `<p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong>.</p>
             <p>This OTP is valid for ${expiryMinutes} minutes.</p>
             <p>Please do not share it with anyone.</p>`,
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw error;
  }
};

export const register = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    mobile,
    accountType,
    businessName = req.body?.businessName ?? req.body?.bussinessName,
    businessType = req.body?.businessType ?? req.body?.bussinessType,
  } = req.body || {};

  name = typeof name === "string" ? name.trim() : "";
  email = typeof email === "string" ? email.trim().toLowerCase() : "";
  mobile = typeof mobile === "string" ? mobile.trim() : "";
  accountType = accountType === "business" ? "business" : "individual";
  businessName = typeof businessName === "string" ? businessName.trim() : "";
  businessType = typeof businessType === "string" ? businessType.trim() : "";

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

  if (accountType === "business" && (!businessName || !businessType)) {
    res.status(400);
    throw new Error("Business name and type are required for business accounts");
  }

  const [existingByEmail, existingByMobile] = await Promise.all([
    User.findOne({ email }).select("+otp +otpExpires"),
    User.findOne({ mobile }).select("+otp +otpExpires"),
  ]);

  if (
    existingByEmail &&
    existingByMobile &&
    String(existingByEmail._id) !== String(existingByMobile._id)
  ) {
    res.status(409);
    throw new Error("Email and mobile number already belong to different accounts");
  }

  const existingUser = existingByEmail || existingByMobile;

  if (existingUser?.isVerified) {
    res.status(409);
    throw new Error("User already exists. Please sign in.");
  }

  if (existingUser) {
    existingUser.name = name;
    existingUser.email = email;
    existingUser.mobile = mobile;
    existingUser.accountType = accountType;
    existingUser.businessName = accountType === "business" ? businessName : undefined;
    existingUser.businessType = accountType === "business" ? businessType : undefined;
    existingUser.customerId = existingUser.customerId || await getNextCustomerId();
    existingUser.isVerified = false;

    await sendRegistrationOtp(existingUser);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
      email: existingUser.email,
      customerId: existingUser.customerId,
    });
  }

  try {
    const user = await User.create({
      customerId: await getNextCustomerId(),
      name,
      email,
      mobile,
      accountType,
      businessName: accountType === "business" ? businessName : undefined,
      businessType: accountType === "business" ? businessType : undefined,
      isVerified: false,
    });

    await sendRegistrationOtp(user);

    return res.status(201).json({
      success: true,
      message: "User registered. OTP sent to your email.",
      email: user.email,
      customerId: user.customerId,
    });
  } catch (err) {
    if (err?.code === 11000) {
      res.status(409);
      throw new Error("User already exists. Please sign in.");
    }
    throw err;
  }
});

export const sendOtp = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();

  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "this emailId already exists, use an alternative emailId.",
    });
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp(otp);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10);

  user.otp = hashedOtp;
  user.otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);
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

  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid otp.");
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.customerId = user.customerId || await getNextCustomerId();
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, res);

  try {
    await sendEmail({
      email: user.email,
      subject: "Login successful - Briefcasse",
      html: buildLoginSuccessEmail(user),
      text: `Hi ${user.name || "Customer"}, thank you for logging in to your Briefcasse account. Customer ID: ${user.customerId || "-"}.`,
    });
  } catch (emailError) {
    console.error("Login Success Email Error:", emailError);
  }

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
      businessName: user.businessName,
      businessType: user.businessType,
      customerId: user.customerId,
      role: user.role,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user: req.user,
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
