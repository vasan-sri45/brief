import mongoose from "mongoose";
import PaidService from "../../models/selling/paidService.model.js";

export const createPaidService = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      customerEmail,
      serviceType,
      service,
      paymentMode,
      totalPayment,
      transactionId,
      notes,
      paymentStatus = "Paid",
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

    const paidService = await PaidService.create({
      user: req.user.role === "user" ? req.user._id : null,
      customer: {
        name: customerName.trim(),
        mobile: customerMobile.trim(),
        email: customerEmail?.trim() || null,
      },
      serviceType,
      service,
      paymentMode,
      totalPayment: Number(totalPayment),
      transactionId: transactionId || null,
      paymentStatus,
      serviceStatus,
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
    } = req.query;

    const query = { isDeleted: false };

    if (serviceType) query.serviceType = serviceType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (serviceStatus) query.serviceStatus = serviceStatus;

    if (search) {
      query.$or = [
        { serviceNo: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.mobile": { $regex: search, $options: "i" } },
      ];
    }

    const services = await PaidService.find(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
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

// // PUT /api/paid/:id
// export const updatePaidService = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     // ID validate
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid service ID",
//       });
//     }

//     if (!req.user?._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     // Frontend ல இருந்து அனுப்பும் editable fields மட்டும் destructure பண்ணு
//     const {
//       totalPayment,
//       serviceStatus,
//       paymentStatus,
//       notes,
//       assignedTo,
//     } = req.body;

//     // update object உருவாக்கு - undefined values avoid பண்ண
//     const updateData = {};

//     if (totalPayment !== undefined) {
//       updateData.totalPayment = Number(totalPayment);
//     }

//     if (serviceStatus) {
//       updateData.serviceStatus = serviceStatus; // "Pending" | "In Progress" | "Completed" | "Cancelled"
//     }

//     if (paymentStatus) {
//       updateData.paymentStatus = paymentStatus; // "Pending" | "Paid" | "Failed" | "Refunded"
//     }

//     if (notes !== undefined) {
//       updateData.notes = notes;
//     }

//     if (assignedTo) {
//       updateData.assignedTo = assignedTo; // Employee ObjectId
//     }

//     // optional: who updated last
//     updateData.updatedAt = new Date();

//     const updated = await PaidService.findOneAndUpdate(
//       { _id: id, isDeleted: false },
//       { $set: updateData },
//       { new: true }
//     )
//       .populate("createdBy", "name email")
//       .populate("assignedTo", "name")
//       .lean();

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Paid service not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Paid service updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// // PUT /api/paid/:id
// export const updatePaidService = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     /* =========================
//        VALIDATION
//     ========================== */
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid service ID",
//       });
//     }

//     if (!req.user?._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     /* =========================
//        ALLOWED EDITABLE FIELDS
//     ========================== */
//     const {
//       serviceType,
//       service,
//       totalPayment,
//       paymentMode,
//       paymentStatus,
//       serviceStatus,
//       notes,
//       assignedTo,
//     } = req.body;

//     const updateData = {};

//     if (serviceType) {
//       updateData.serviceType = serviceType;
//     }

//     if (service) {
//       updateData.service = service; // heading value
//     }

//     if (paymentMode) {
//       updateData.paymentMode = paymentMode;
//     }

//     if (totalPayment !== undefined) {
//       updateData.totalPayment = Number(totalPayment);
//     }

//     if (paymentStatus) {
//       updateData.paymentStatus = paymentStatus;
//     }

//     if (serviceStatus) {
//       updateData.serviceStatus = serviceStatus;
//     }

//     if (notes !== undefined) {
//       updateData.notes = notes;
//     }

//     if (assignedTo) {
//       updateData.assignedTo = assignedTo;
//     }

//     updateData.updatedAt = new Date();

//     /* =========================
//        UPDATE DB
//     ========================== */
//     const updated = await PaidService.findOneAndUpdate(
//       { _id: id, isDeleted: false },
//       { $set: updateData },
//       { new: true }
//     )
//       .populate("createdBy", "name email")
//       .populate("assignedTo", "name")
//       .lean();

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Paid service not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Paid service updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


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
      service,
      totalPayment,
      paymentMode,
      paymentStatus,
      serviceStatus,
      notes,
      assignedTo,
    } = req.body;

    const updateData = {};

    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (service !== undefined) updateData.service = service;
    if (paymentMode !== undefined) updateData.paymentMode = paymentMode;
    if (totalPayment !== undefined)
      updateData.totalPayment = Number(totalPayment);
    if (paymentStatus !== undefined)
      updateData.paymentStatus = paymentStatus;
    if (serviceStatus !== undefined)
      updateData.serviceStatus = serviceStatus;
    if (notes !== undefined) updateData.notes = notes;

    // ✅ CRITICAL FIX
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo || null;
    }

    updateData.updatedAt = new Date();

    const updated = await PaidService.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name")
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
