import crypto from "crypto";
import Payment from "../../models/services/payment.model.js";
import Service from "../../models/services/service.model.js";
import { razorpay } from "../../utils/razorpay.js";
import User from "../../models/auth/user.js";
import sendEmail from "../../utils/email.js";

const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_EMAIL || "admin@briefcasse.com";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatInvoiceDate = (date) =>
  new Date(date || Date.now()).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatInvoiceDateOnly = (date) =>
  new Date(date || Date.now()).toLocaleDateString("en-IN");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const GST_RATE = 18;

const roundCurrency = (value = 0) => Math.round(Number(value || 0));

const calculateGstBreakdown = (baseAmount = 0) => {
  const taxableAmount = roundCurrency(baseAmount);
  const gstAmount = roundCurrency((taxableAmount * GST_RATE) / 100);
  const totalAmount = taxableAmount + gstAmount;

  return {
    baseAmount: taxableAmount,
    gstRate: GST_RATE,
    gstAmount,
    totalAmount,
  };
};

const getPaymentServiceName = (payment) =>
  payment.serviceId?.heading ||
  payment.serviceId?.title ||
  payment.serviceSlug ||
  "Briefcasse Service";

const getPaymentServiceTitle = (payment) =>
  payment.serviceId?.title || payment.serviceId?.heading || "Briefcasse Service";

const getInvoiceData = (payment, paymentId) => {
  const serviceName =
    getPaymentServiceName(payment);
  const baseAmount = Number(payment.baseAmount || payment.amount || 0);
  const gstRate = Number(payment.gstRate ?? GST_RATE);
  const gstAmount = Number(payment.gstAmount || 0);
  const totalAmount = Number(payment.amount || baseAmount + gstAmount || 0);
  const customerName = payment.userId?.name || payment.customer?.name || "Customer";
  const customerMobile = payment.userId?.mobile || payment.customer?.mobile || "-";
  const customerEmail = payment.userId?.email || payment.customer?.email || "-";

  return {
    invoiceNo: payment.serviceNo || payment.razorpayOrderId || payment._id || "-",
    date: payment.paymentDate || payment.createdAt || new Date(),
    customerName,
    customerMobile,
    customerEmail,
    serviceTitle: getPaymentServiceTitle(payment),
    serviceName,
    serviceId: payment.serviceNo || payment._id || "-",
    paymentMode: payment.paymentMode || "Online",
    paymentStatus: payment.status || "paid",
    paymentId: paymentId || payment.razorpayPaymentId || "-",
    baseAmount,
    gstRate,
    gstAmount,
    totalAmount,
  };
};

const buildInvoiceDocumentHtml = (payment, paymentId) => {
  const invoice = getInvoiceData(payment, paymentId);
  const rows = [
    ["Service Title", invoice.serviceTitle],
    ["Service Name", invoice.serviceName],
    ["Service ID", invoice.serviceId],
    ["Payment Mode", invoice.paymentMode],
    ["Payment Status", invoice.paymentStatus],
    ["Payment ID", invoice.paymentId],
    ["Service Price", formatCurrency(invoice.baseAmount)],
    [`GST (${invoice.gstRate}%)`, formatCurrency(invoice.gstAmount)],
  ];

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${escapeHtml(invoice.invoiceNo)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
          .top { display: flex; justify-content: space-between; border-bottom: 3px solid #374296; padding-bottom: 18px; gap: 24px; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .logo { width: 72px; height: 54px; border-radius: 8px; background: #374296; position: relative; }
          .logo:before { content: ""; position: absolute; left: 13px; top: 13px; width: 46px; height: 8px; background: #fff; transform: skewX(-30deg); }
          .logo:after { content: ""; position: absolute; left: 15px; bottom: 11px; width: 40px; height: 26px; border-left: 7px solid #fff; border-right: 7px solid #fff; transform: skewX(-35deg); }
          h1 { margin: 0; color: #374296; letter-spacing: .3px; }
          h2 { margin: 8px 0 0; }
          p { margin: 7px 0; }
          .box { margin-top: 26px; border: 1px solid #dbeafe; border-radius: 14px; padding: 18px; }
          .row { display: flex; justify-content: space-between; gap: 18px; border-bottom: 1px solid #e5e7eb; padding: 12px 0; }
          .row:last-child { border-bottom: 0; }
          .label { color: #64748b; font-weight: 700; }
          .total { margin-top: 22px; background: #eff6ff; padding: 18px; border-radius: 14px; font-size: 22px; font-weight: 800; color: #172033; }
          .note { margin-top: 28px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="top">
          <div class="brand">
            <div class="logo"></div>
            <div>
              <h1>Briefcasse</h1>
              <p>Legal | Compliance | IP Services</p>
            </div>
          </div>
          <div>
            <h2>Tax Invoice</h2>
            <p><b>Invoice No:</b> ${escapeHtml(invoice.invoiceNo)}</p>
            <p><b>Date:</b> ${escapeHtml(formatInvoiceDateOnly(invoice.date))}</p>
          </div>
        </div>
        <div class="box">
          <h3>Bill To</h3>
          <p>${escapeHtml(invoice.customerName)}</p>
          <p>${escapeHtml(invoice.customerMobile)}</p>
          <p>${escapeHtml(invoice.customerEmail)}</p>
        </div>
        <div class="box">
          ${rows
            .map(
              ([label, value]) =>
                `<div class="row"><span class="label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`
            )
            .join("")}
        </div>
        <div class="total">Total Paid: ${escapeHtml(formatCurrency(invoice.totalAmount))}</div>
        <p class="note">This is a computer-generated invoice.</p>
      </body>
    </html>
  `;
};

const getInvoiceAttachment = (payment, paymentId) => {
  const invoiceNo = payment.serviceNo || payment.razorpayOrderId || payment._id || "invoice";
  const fileName = `briefcasse-invoice-${String(invoiceNo).replace(/[^a-z0-9-]/gi, "-")}.html`;

  return {
    filename: fileName,
    content: buildInvoiceDocumentHtml(payment, paymentId),
    contentType: "text/html",
  };
};

const buildInvoiceEmail = (payment, paymentId) => {
  const invoice = getInvoiceData(payment, paymentId);

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8fc;padding:24px;color:#172033">
      <div style="max-width:680px;margin:auto;background:#ffffff;border:1px solid #dce7ff;border-radius:18px;overflow:hidden">
        <div style="background:#2563eb;color:#ffffff;padding:24px">
          <h1 style="margin:0;font-size:26px">Thank you for purchasing a Briefcasse service</h1>
          <p style="margin:8px 0 0">Your online payment has been verified successfully.</p>
        </div>
        <div style="padding:24px">
          <p style="margin:0 0 18px;line-height:1.7;color:#475569">
            Dear ${escapeHtml(invoice.customerName)}, thank you for choosing Briefcasse.
            Our team has received your service request and will begin the next steps shortly.
            Your invoice document is attached to this email for download and printing.
          </p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Service Name</td><td style="padding:10px;border-bottom:1px solid #edf2ff;font-weight:700">${escapeHtml(invoice.serviceName)}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Service ID</td><td style="padding:10px;border-bottom:1px solid #edf2ff;font-weight:700">${escapeHtml(invoice.serviceId)}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Payment ID</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${escapeHtml(invoice.paymentId)}</td></tr>
            <tr><td style="padding:10px;color:#64748b">Amount Paid</td><td style="padding:10px;font-size:22px;font-weight:800;color:#2563eb">${escapeHtml(formatCurrency(invoice.totalAmount))}</td></tr>
          </table>
          <p style="margin-top:24px;color:#475569;line-height:1.7">
            We will review your service details, confirm any required documents,
            and keep you updated through your Briefcasse account.
          </p>
        </div>
      </div>
    </div>
  `;
};

const buildAdminPaymentNotificationEmail = (payment, paymentId) => {
  const serviceName =
    payment.serviceId?.heading ||
    payment.serviceId?.title ||
    payment.serviceSlug ||
    "Briefcasse Service";
  const customerName = payment.userId?.name || payment.customer?.name || "Customer";
  const customerEmail = payment.userId?.email || payment.customer?.email || "Not available";
  const customerMobile = payment.userId?.mobile || payment.customer?.mobile || "Not available";

  return `
    <div style="font-family:Arial,sans-serif;background:#f6f8fc;padding:24px;color:#172033">
      <div style="max-width:680px;margin:auto;background:#ffffff;border:1px solid #dce7ff;border-radius:18px;overflow:hidden">
        <div style="background:#172033;color:#ffffff;padding:24px">
          <h1 style="margin:0;font-size:24px">New service purchase</h1>
          <p style="margin:8px 0 0">A customer completed an online payment.</p>
        </div>
        <div style="padding:24px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Service No</td><td style="padding:10px;border-bottom:1px solid #edf2ff;font-weight:700">${payment.serviceNo}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Service</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${serviceName}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Customer</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${customerName}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Email</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${customerEmail}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Mobile</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${customerMobile}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #edf2ff;color:#64748b">Payment ID</td><td style="padding:10px;border-bottom:1px solid #edf2ff">${paymentId}</td></tr>
            <tr><td style="padding:10px;color:#64748b">Amount</td><td style="padding:10px;font-size:20px;font-weight:800;color:#2563eb">${formatCurrency(payment.amount)}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;
};

/* =====================================================
   CREATE ORDER
===================================================== */
export const createOrder = async (req, res) => {
  try {
    const { slug, price } = req.body;
    const userId = req.user?._id;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Service slug required",
      });
    }

    /* 🔒 Always fetch service price from DB */
    const service = await Service.findOne({ slug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const validPlanPrices = (service.prices || [])
      .filter((plan) => plan.type === "payment")
      .map((plan) => Number(plan.amount));
    const requestedPrice = Number(
      price || service.price || validPlanPrices[0]
    );
    const validAmount =
      validPlanPrices.length === 0 ||
      validPlanPrices.includes(requestedPrice) ||
      Number(service.price) === requestedPrice;

    if (!requestedPrice || !validAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid service price",
      });
    }

    const { baseAmount, gstRate, gstAmount, totalAmount } =
      calculateGstBreakdown(requestedPrice);
    const amount = totalAmount * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const user = await User.findById(userId).lean();

    /* Save payment record */
    const payment = await Payment.create({
      serviceId: service._id,
      userId,
      customer: {
        userCode: user?.customerId || "",
        customerId: user?.customerId || "",
        name: user?.name || "",
        mobile: user?.mobile || "",
        email: user?.email || "",
      },
      serviceSlug: slug,
      baseAmount,
      gstRate,
      gstAmount,
      amount: totalAmount,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({
      success: true,
      orderId: order.id,
      serviceNo: payment.serviceNo,
      amount: order.amount,
      baseAmount,
      gstRate,
      gstAmount,
      totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Create Order Error:", err);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


/* =====================================================
   VERIFY PAYMENT
===================================================== */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    /* Find payment record */
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    /* Prevent duplicate verification */
    if (payment.status === "paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {

      payment.status = "failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    /* Update payment */
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.paymentDate = new Date();

    await payment.save();

    const populatedPayment = await Payment.findById(payment._id)
      .populate("serviceId", "title heading price")
      .populate("userId", "name email mobile")
      .lean();

    const invoiceEmail =
      populatedPayment?.userId?.email || populatedPayment?.customer?.email;

    if (invoiceEmail) {
      try {
        await sendEmail({
          email: invoiceEmail,
          subject: `Thank you for your purchase - Invoice ${payment.serviceNo} - Briefcasse`,
          html: buildInvoiceEmail(populatedPayment, razorpay_payment_id),
          attachments: [getInvoiceAttachment(populatedPayment, razorpay_payment_id)],
        });
      } catch (emailError) {
        console.error("Invoice Email Error:", emailError);
      }
    }

    if (ADMIN_NOTIFICATION_EMAIL) {
      try {
        await sendEmail({
          email: ADMIN_NOTIFICATION_EMAIL,
          subject: `New online service purchase ${payment.serviceNo} - Briefcasse`,
          html: buildAdminPaymentNotificationEmail(
            populatedPayment,
            razorpay_payment_id
          ),
          attachments: [getInvoiceAttachment(populatedPayment, razorpay_payment_id)],
        });
      } catch (adminEmailError) {
        console.error("Admin Payment Notification Error:", adminEmailError);
      }
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      invoice: populatedPayment,
    });

  } catch (err) {
    console.error("Verify Payment Error:", err);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};


/* =====================================================
   GET ALL ORDERS (PAGINATION)
===================================================== */
export const getAllOrders = async (req, res) => {
  try {

    if (!req.user?._id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const assignedTo = req.query.assignedTo;

    const skip = (page - 1) * limit;
    const query =
      req.user.role === "admin"
        ? { adminHidden: { $ne: true } }
        : { employeeHidden: { $ne: true } };

    if (req.user.role === "employee") {
      query.assignedTo = req.user._id;
    }

    if (req.user.role === "admin" && assignedTo && assignedTo !== "All") {
      query.assignedTo = assignedTo;
    }

    const orders = await Payment.find(query)
      .select(
        "serviceNo serviceId userId customer amount baseAmount gstAmount gstRate status serviceStatus transactionStage transactionStages paymentMode paymentDate assignedTo progressMessages createdAt updatedAt"
      )
      .populate("serviceId", "title price heading")
      .populate("userId", "name email mobile")
      .populate("assignedTo", "name")
      .populate("progressMessages.createdBy", "name employee_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });

  } catch (err) {
    console.error("Get Orders Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   UPDATE PAYMENT / SERVICE STATUS
===================================================== */
const normalizeOnlinePaymentStatus = (value = "created") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "paid") return "paid";
  if (normalized === "failed") return "failed";
  return "created";
};

const SERVICE_STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"];

const TRANSACTION_STAGES = [
  "Just In",
  "Attempt to Contact",
  "Awaiting Document",
  "Document Preparation",
  "Final Draft",
  "Conclusion Stage",
  "Completed",
];

const normalizeServiceStatus = (value = "Pending") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "in progress") return "In Progress";
  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled") return "Cancelled";

  const status = SERVICE_STATUSES.find(
    (item) => item.toLowerCase() === normalized
  );

  return status || "Pending";
};

const normalizeTransactionStage = (value = "Just In") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized || normalized === "pending") return "Just In";
  if (normalized === "in progress") return "Document Preparation";
  if (normalized === "cancelled") return "Conclusion Stage";

  const stage = TRANSACTION_STAGES.find(
    (item) => item.toLowerCase() === normalized
  );

  return stage || "Just In";
};

const normalizeTransactionStages = (value) => {
  const source = Array.isArray(value) ? value : [value];
  const stages = source
    .flatMap((item) => String(item || "").split(","))
    .map((item) => normalizeTransactionStage(item))
    .filter(Boolean);
  const uniqueStages = TRANSACTION_STAGES.filter((stage) =>
    stages.includes(stage)
  );

  return uniqueStages.length ? uniqueStages : ["Just In"];
};

export const updatePaymentService = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      paymentStatus,
      serviceStatus,
      transactionStage,
      transactionStages,
      assignedTo,
      paymentMode,
      progressMessage,
    } = req.body;

    const updateData = {};
    const pushData = {};
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      const assignedPayment = await Payment.findOne({
        _id: id,
        assignedTo: req.user._id,
      });

      if (!assignedPayment) {
        return res.status(403).json({
          success: false,
          message: "You can update only services assigned to you",
        });
      }
    }

    if (isAdmin && paymentStatus !== undefined)
      updateData.status = normalizeOnlinePaymentStatus(paymentStatus);

    if (serviceStatus !== undefined)
      updateData.serviceStatus = normalizeServiceStatus(serviceStatus);

    if (transactionStages !== undefined) {
      updateData.transactionStages = normalizeTransactionStages(transactionStages);
      updateData.transactionStage = updateData.transactionStages.at(-1);
    } else if (transactionStage !== undefined) {
      updateData.transactionStage = normalizeTransactionStage(transactionStage);
      updateData.transactionStages = normalizeTransactionStages(transactionStage);
    }

    if (isAdmin && paymentMode !== undefined)
      updateData.paymentMode = paymentMode;

    if (isAdmin && assignedTo !== undefined)
      updateData.assignedTo = assignedTo || null;

    if (progressMessage?.trim()) {
      pushData.progressMessages = {
        message: progressMessage.trim(),
        createdBy: req.user._id,
        createdAt: new Date(),
      };
    }

    const updated = await Payment.findByIdAndUpdate(
      id,
      {
        ...(Object.keys(updateData).length ? { $set: updateData } : {}),
        ...(Object.keys(pushData).length ? { $push: pushData } : {}),
      },
      { new: true }
    )
      .populate("serviceId", "title")
      .populate("assignedTo", "name")
      .populate("progressMessages.createdBy", "name employee_id");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: updated,
    });

  } catch (err) {
    console.error("Update Payment Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   GET CURRENT USER ORDERS
===================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const orders = await Payment.find({ userId: req.user._id })
      .select(
        "serviceNo serviceId amount baseAmount gstAmount gstRate status serviceStatus transactionStage transactionStages paymentMode paymentDate razorpayPaymentId assignedTo progressMessages createdAt updatedAt"
      )
      .populate("serviceId", "title price heading slug")
      .populate("assignedTo", "name employee_id")
      .populate("progressMessages.createdBy", "name employee_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (err) {
    console.error("Get My Orders Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   SOFT HIDE COMPLETED ONLINE SERVICE
===================================================== */
export const softDeletePaymentService = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.serviceStatus !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed services can be removed",
      });
    }

    if (!isAdmin) {
      if (
        !payment.assignedTo ||
        payment.assignedTo.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can remove only services assigned to you",
        });
      }

      payment.employeeHidden = true;
    } else {
      payment.adminHidden = true;
    }

    await payment.save();

    res.json({
      success: true,
      message: isAdmin
        ? "Completed service removed from admin view"
        : "Completed service removed from your list",
    });
  } catch (err) {
    console.error("Soft Delete Payment Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
