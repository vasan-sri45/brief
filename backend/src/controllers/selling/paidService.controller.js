import mongoose from "mongoose";
import PaidService from "../../models/selling/paidService.model.js";
import Payment from "../../models/services/payment.model.js";
import Counter from "../../models/selling/counter.model.js";
import User from "../../models/auth/user.js";

const normalizeCustomerCode = (value = "") =>
  String(value).trim().toUpperCase();

const buildCustomerCodeRegex = (customerCode) =>
  new RegExp(`^${customerCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

const generateCustomerCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: "customerNo" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `CUS${String(counter.seq).padStart(5, "0")}`;
};

const staleCustomerUniqueFields = new Set([
  "name",
  "email",
  "mobile",
  "customer.name",
  "customer.email",
  "customer.mobile",
]);

const dropStaleCustomerUniqueIndex = async (error) => {
  if (error?.code !== 11000) return false;

  const duplicateFields = Object.keys(error.keyPattern || error.keyValue || {});
  const staleField = duplicateFields.find((field) =>
    staleCustomerUniqueFields.has(field)
  );

  if (!staleField) return false;

  const indexes = await PaidService.collection.indexes();
  const staleIndex = indexes.find((index) => {
    const keys = Object.keys(index.key || {});
    return index.unique && keys.length === 1 && keys[0] === staleField;
  });

  if (!staleIndex?.name) return false;

  await PaidService.collection.dropIndex(staleIndex.name);
  return true;
};

const createPaidServiceWithIndexRepair = async (payload) => {
  try {
    return await PaidService.create(payload);
  } catch (error) {
    const repaired = await dropStaleCustomerUniqueIndex(error);
    if (!repaired) throw error;
    return PaidService.create(payload);
  }
};

const splitCustomerName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
};

const normalizeOnlineOrderForLookup = (order) => ({
  ...order,
  serviceType: "Online Service",
  serviceTitle: order.serviceId?.title || order.serviceId?.heading || "",
  serviceName: order.serviceId?.heading || order.serviceId?.title || "",
  service: order.serviceId,
  totalPayment: order.amount,
  paymentStatus: order.status,
  customer: {
    userCode:
      order.userId?.customerId ||
      order.customer?.userCode ||
      order.customer?.customerId ||
      "",
    customerId:
      order.userId?.customerId ||
      order.customer?.customerId ||
      order.customer?.userCode ||
      "",
    name: order.userId?.name || order.customer?.name || "",
    mobile: order.userId?.mobile || order.customer?.mobile || "",
    email: order.userId?.email || order.customer?.email || "",
  },
});

const getOnlineOrdersByCustomer = async (user, customerCode) => {
  const filters = [
    { "customer.userCode": customerCode },
    { "customer.customerId": customerCode },
  ];

  if (user?._id) {
    filters.push({ userId: user._id });
  }

  if (user?.email) {
    filters.push({ "customer.email": user.email });
  }

  if (user?.mobile) {
    filters.push({ "customer.mobile": user.mobile });
  }

  const orders = await Payment.find({
    $or: filters,
    adminHidden: { $ne: true },
  })
    .populate("serviceId", "title heading")
    .populate("userId", "customerId name email mobile")
    .sort({ createdAt: -1 })
    .lean();

  return orders.map(normalizeOnlineOrderForLookup);
};

const normalizePaymentStatus = (value = "Pending") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "paid") return "Paid";
  if (normalized === "failed") return "Failed";
  if (normalized === "refunded") return "Refunded";
  return "Pending";
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

export const createPaidService = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      customerUserId,
      clientType = "new",
      serviceType,
      serviceTitle,
      serviceName,
      service,
      paymentMode,
      totalPayment,
      transactionId,
      notes,
      paymentStatus,
      serviceStatus = "Pending",
      transactionStage = "Just In",
      transactionStages,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (
      !customerName?.trim() ||
      !customerMobile?.trim() ||
      !serviceType ||
      !service ||
      !paymentMode ||
      totalPayment === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    let customerCode = normalizeCustomerCode(customerUserId);
    const isPreviousClient = clientType === "previous";
    let linkedUserId = null;
    const existingUser = customerCode
      ? await User.findOne({ customerId: buildCustomerCodeRegex(customerCode) })
          .select("_id customerId")
          .lean()
      : null;

    if (isPreviousClient) {
      if (!customerCode) {
        return res.status(400).json({
          success: false,
          message: "Customer ID is required for previous clients",
        });
      }

      const existingCustomer = await PaidService.findOne({
        "customer.userCode": customerCode,
        isDeleted: false,
      }).lean();

      if (existingCustomer?.user) {
        linkedUserId = existingCustomer.user;
      }

      if (!linkedUserId && existingUser?._id) {
        linkedUserId = existingUser._id;
      }

      if (!existingCustomer && !linkedUserId) {
        return res.status(404).json({
          success: false,
          message: "No previous client found with this customer ID",
        });
      }
    } else if (!customerCode) {
      customerCode = await generateCustomerCode();
    } else if (existingUser?._id) {
      linkedUserId = existingUser._id;
    }

    const paidService = await createPaidServiceWithIndexRepair({
      user: linkedUserId || (req.user.role === "user" ? req.user._id : null),
      customer: {
        userCode: customerCode,
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail?.trim() || null,
      },
      serviceType,
      serviceTitle: serviceTitle?.trim() || "",
      serviceName: serviceName?.trim() || "",
      service,
      paymentMode,
      totalPayment: Number(totalPayment),
      transactionId: transactionId || null,
      paymentStatus:
        Number(totalPayment || 0) <= 0
          ? "Pending"
          : normalizePaymentStatus(paymentStatus || "Paid"),
      serviceStatus: normalizeServiceStatus(serviceStatus),
      transactionStages: normalizeTransactionStages(
        transactionStages || transactionStage
      ),
      transactionStage: normalizeTransactionStages(
        transactionStages || transactionStage
      ).at(-1),
      notes: notes || "",
      createdBy: req.user._id,
    });


    return res.status(201).json({
      success: true,
      message: "Service payment recorded successfully",
      data: paidService,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerByUserCode = async (req, res, next) => {
  try {
    const userCode = normalizeCustomerCode(req.params.userCode);

    if (!userCode) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const services = await PaidService.find({
      "customer.userCode": userCode,
      isDeleted: false,
    })
      .populate("service", "title heading")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .lean();

    const user = await User.findOne({ customerId: buildCustomerCodeRegex(userCode) })
      .select("_id customerId name email mobile")
      .lean();

    const onlineServices = await getOnlineOrdersByCustomer(user, userCode);

    if (!services.length && !onlineServices.length) {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          userCode: user.customerId,
          customer: {
            userCode: user.customerId,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            ...splitCustomerName(user.name),
          },
          services: onlineServices,
        },
      });
    }

    const allServices = [...onlineServices, ...services].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    const latest = allServices[0] || services[0];
    const customer = user
      ? {
          userCode: user.customerId,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          ...splitCustomerName(user.name),
        }
      : {
          ...latest.customer,
          ...splitCustomerName(latest.customer?.name),
        };

    return res.status(200).json({
      success: true,
      data: {
        userCode,
        customer,
        services: allServices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPaidServices = async (req, res, next) => {
  try {
    // 🔐 Auth check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      page = 1,
      limit = 10,
      serviceType,
      paymentStatus,
      serviceStatus,
      search,
      assignedTo,
    } = req.query;

    const query = { isDeleted: false };

    if (req.user.role === "employee") {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
      query.employeeHidden = { $ne: true };
    } else if (req.user.role === "admin") {
      query.$or = [
        { createdBy: req.user._id },
        { paymentStatus: { $in: ["Paid", "paid"] } },
      ];
    }

    if (serviceType) query.serviceType = serviceType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (serviceStatus) query.serviceStatus = serviceStatus;
    if (req.user.role === "admin" && assignedTo && assignedTo !== "All") {
      query.assignedTo = assignedTo;
    }

    if (search) {
      const searchQuery = [
        { serviceNo: { $regex: search, $options: "i" } },
        { "customer.userCode": { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.mobile": { $regex: search, $options: "i" } },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchQuery }];
        delete query.$or;
      } else {
        query.$or = searchQuery;
      }
    }

    const services = await PaidService.find(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
      .populate("progressMessages.createdBy", "name employee_id")
      .populate("service","title heading")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await PaidService.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaidServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await PaidService.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Paid service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


export const getPaidServiceByServiceNo = async (req, res, next) => {
  try {
    const { serviceNo } = req.params;

    const service = await PaidService.findOne({
      serviceNo,
      isDeleted: false,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
      .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};


export const getMyPaidServices = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const query =
      req.user.role === "user"
        ? { user: req.user._id }
        : { createdBy: req.user._id };

    query.isDeleted = false;

    const services = await PaidService.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/paid/:id
export const updatePaidService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      serviceType,
      serviceTitle,
      serviceName,
      service,
      totalPayment,
      paymentMode,
      paymentStatus,
      serviceStatus,
      transactionStage,
      transactionStages,
      notes,
      assignedTo,
      progressMessage,
    } = req.body;

    const updateData = {};
    const pushData = {};
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      const assignedService = await PaidService.findOne({
        _id: id,
        $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
        isDeleted: false,
      });

      if (!assignedService) {
        return res.status(403).json({
          success: false,
          message: "You can update only services assigned to you",
        });
      }
    }

    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (serviceTitle !== undefined) updateData.serviceTitle = serviceTitle;
    if (serviceName !== undefined) updateData.serviceName = serviceName;
    if (service !== undefined) updateData.service = service || null;
    if (isAdmin && paymentMode !== undefined) updateData.paymentMode = paymentMode;
    if (totalPayment !== undefined)
      updateData.totalPayment = Number(totalPayment);
    if (paymentStatus !== undefined)
      updateData.paymentStatus = normalizePaymentStatus(paymentStatus);
    if (serviceStatus !== undefined)
      updateData.serviceStatus = normalizeServiceStatus(serviceStatus);
    if (transactionStages !== undefined) {
      updateData.transactionStages = normalizeTransactionStages(transactionStages);
      updateData.transactionStage = updateData.transactionStages.at(-1);
    } else if (transactionStage !== undefined) {
      updateData.transactionStage = normalizeTransactionStage(transactionStage);
      updateData.transactionStages = normalizeTransactionStages(transactionStage);
    }
    if (isAdmin && notes !== undefined) updateData.notes = notes;

    if (isAdmin && assignedTo !== undefined) {
      updateData.assignedTo = assignedTo || null;
    }

    if (progressMessage?.trim()) {
      pushData.progressMessages = {
        message: progressMessage.trim(),
        createdBy: req.user._id,
        createdAt: new Date(),
      };
    }

    updateData.updatedAt = new Date();

    const updated = await PaidService.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        ...(Object.keys(updateData).length ? { $set: updateData } : {}),
        ...(Object.keys(pushData).length ? { $push: pushData } : {}),
      },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
      .populate("progressMessages.createdBy", "name employee_id")
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Paid service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Paid service updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeletePaidService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const service = await PaidService.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Paid service not found",
      });
    }

    if (service.serviceStatus !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed services can be removed",
      });
    }

    if (req.user.role === "admin") {
      service.isDeleted = true;
      await service.save();

      return res.status(200).json({
        success: true,
        message: "Completed service deleted from active list",
      });
    }

    if (
      !service.assignedTo ||
      service.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can remove only services assigned to you",
      });
    }

    service.employeeHidden = true;
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Completed service removed from your list",
    });
  } catch (error) {
    next(error);
  }
};
