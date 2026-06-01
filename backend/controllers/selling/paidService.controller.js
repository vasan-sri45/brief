import mongoose from "mongoose";
import PaidService from "../../models/selling/paidService.model.js";
import Counter from "../../models/selling/counter.model.js";

const normalizeCustomerCode = (value = "") =>
  String(value).trim().toUpperCase();

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

const normalizePaymentStatus = (value = "Pending") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "paid") return "Paid";
  if (normalized === "failed") return "Failed";
  if (normalized === "refunded") return "Refunded";
  return "Pending";
};

const normalizeServiceStatus = (value = "Pending") => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "in progress") return "In Progress";
  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled") return "Cancelled";
  return "Pending";
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

      if (!existingCustomer) {
        return res.status(404).json({
          success: false,
          message: "No previous client found with this customer ID",
        });
      }
    } else if (!customerCode) {
      customerCode = await generateCustomerCode();
    }

    const paidService = await createPaidServiceWithIndexRepair({
      user: req.user.role === "user" ? req.user._id : null,
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

    if (!services.length) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const latest = services[0];

    return res.status(200).json({
      success: true,
      data: {
        userCode,
        customer: {
          ...latest.customer,
          ...splitCustomerName(latest.customer?.name),
        },
        services,
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
