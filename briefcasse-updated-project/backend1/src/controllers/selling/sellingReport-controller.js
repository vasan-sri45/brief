import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import SellingReport from '../../models/sellingReport.js';
import CompanyRegistration from '../../models/serviceList.js'; // model name that holds items

const { ObjectId } = mongoose.Types;

// POST /api/selling/add
export const addSellingReport = asyncHandler(async (req, res) => {
  let { name, serviceItems, modeOfPayment, totalPayment } = req.body;

  // Normalize serviceItems to array
  if (typeof serviceItems === 'string') {
    try {
      const maybeArray = JSON.parse(serviceItems);
      serviceItems = Array.isArray(maybeArray) ? maybeArray : [serviceItems];
    } catch {
      serviceItems = [serviceItems];
    }
  } else if (!Array.isArray(serviceItems)) {
    serviceItems = [];
  }

  // Basic required checks
  if (!name || serviceItems.length === 0 || !modeOfPayment || totalPayment == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields for selling report' });
  }

  // ObjectId format validation
  const invalidIds = serviceItems.filter(id => !ObjectId.isValid(id));
  if (invalidIds.length) {
    return res.status(400).json({ success: false, message: `Invalid serviceItems ids: ${invalidIds.join(',')}` });
  }

  // Ensure all referenced docs exist
  const existingCount = await CompanyRegistration.countDocuments({ _id: { $in: serviceItems } });
  if (existingCount !== serviceItems.length) {
    return res.status(404).json({ success: false, message: 'One or more referenced service items not found' });
  }

  // Create (DON'T send serviceNum; hook will fill it)
  const report = await SellingReport.create({
    name,
    serviceItems,
    modeOfPayment,
    totalPayment
  }); // model handles serviceNum [web:3][web:76]

  const populated = await report.populate('serviceItems'); // array populate [web:19]
  return res.status(201).json({ success: true, report: populated });
});

// controllers/sellingReport.controller.js
export const listSellingReports = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const { status, q, from, to } = req.query;

  const match = {};
  if (status) match.status = status; // open/closed/resolved [web:56]
  if (q) match.name = { $regex: q, $options: 'i' }; // search by name [web:56]
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const docs = await SellingReport.find(match)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)   
    .populate('serviceItems') // only needed fields [web:19][web:146]);

  const total = await SellingReport.countDocuments(match); // total items [web:127]
  return res.json({
    success: true,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: docs
  });
});

export const getSellingReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await SellingReport.findById(id)
    .populate('serviceItems'); // full referenced docs [web:19]

  if (!doc) return res.status(404).json({ success: false, message: 'Report not found' });
  return res.json({ success: true, data: doc });
});

export const searchSellingReports = asyncHandler(async (req, res) => {
  const { serviceNum, from, to } = req.query;

  const match = {};
  if (serviceNum) match.serviceNum = serviceNum; // exact match [web:56]
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const docs = await SellingReport.find(match)
    .sort({ createdAt: -1 })
    .populate('serviceItems', 'title subTitle heading'); // select fields [web:19][web:146]

  return res.json({ success: true, data: docs });
});
