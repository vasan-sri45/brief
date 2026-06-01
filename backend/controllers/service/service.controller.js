import Service from '../../models/services/service.model.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { uploadToCloudinary, cloudinary } from '../../helpers/cloudinary.js';


const serviceOrder = [
  "Private Limited Company Registration",
  "Limited Liability Partnership Registration",
  "One Person Company Registration",
  "Partnership Firm Registration",
  "Sole Proprietorship Firm Registration",

  "Register on Indian Subsidiary",
  "Section 8 Company Registration",
  "Producer Company Registration",

  "Association Registration",
  "Trust Registration",
  "Society Registration",

  "Trademark Registration",
  "Trademark Objection Reply",
  "Trademark Opposition",
  "Trademark Assignment",
  "Trademark Renewal",

  "Copyright Registration",

  "Patent Search",
  "Provisional Patent",
  "Permanent Patent",

  "Design",
  "Geographical Indication (GI)",

  "GST Return Filing",
  "GSTR-3B",
  "GST 9R",
  "ITR Filing",
  "E-Way Bill",
  "TDS Return Filing",

  "Annual Compliances for Private Limited Company",
  "Annual Filing for Limited Liability Partnership",
  "File DIR-3 KYC",
  "File INC-20A",
  "File INC-22A",

  "Trusteeship Registration Compliance",
  "Association Registration Compliance",
  "Society Registration Compliance",
  "One Person Compliances",
  "Partnership Firm Compliances",
  "Sole Proprietorship Firm Compliances",

  "Compliance on Indian Subsidiary Registration",
  "Section 8 Company Compliance",
  "Producer Company Compliance",

  "DSC Registration",
  "Import Export Code Registration",
  "Startup India Registration",
  "LUT Under GST",
  "Udyam MSME Registration",
  "Shop & Establishment Registration",
  "Professional Tax Registration",
  "PAN Application",
  "TAN Application",
  "FSSAI Registration",
  "ESI Registration",

  "Talk to Lawyer",
  "Talk to Chartered Accountant",
  "Talk to Company Secretary",

  "Employment",
  "Corporate",
  "Daily Business",
  "Legal Agreement",
  "Banking & Finance",
  "Real Estate",

  "Legal Opinion",

  "Proprietorship to Partnership",
  "Proprietorship to LLP",
  "Proprietorship to Private LTD Company",
  "Proprietorship to OPC",

  "Partnership to LLP",
  "Partnership to Private LTD Company",

  "LLP to Private LTD Company",
  "OPC to Private LTD Company",
  "Private Company to Public Company",

  "Add or Remove a Director (Company)",
  "Add or Remove a Partner (LLP)",
  "Change Business Activity",
  "Change Registered Office",
  "Change Company Name",
  "Change LLP Agreement",
  "Change Partnership Deed",
  "Increase Authorised Share Capital",

  "Close a Private LTD Company",
  "Close an LTD Liability Partnership",
  "Close a One Person Company",
  "Dissolve a Partnership Firm"
];

const normalizeArray = (schemaName, arr) => {
  if (!Array.isArray(arr)) return [];
  
  return arr.map(item => {
    const normalized = { ...item };
    
    if (['documents', 'content', 'trademark'].includes(schemaName)) {
      normalized.name = item.name?.trim() || '';
      normalized.details = item.details?.trim() || '';
    } else if (schemaName === "faqs") {
      normalized.question = item.question?.trim() || "";
      normalized.answer = item.answer?.trim() || "";
      normalized.displayOrder = Number(item.displayOrder || 0);
    } else if (['process', 'processAtBriefcase'].includes(schemaName)) {
      normalized.days = item.days?.trim() || null;
      normalized.step = typeof item.step === 'number' ? item.step : 
                       (item.step ? Math.floor(Number(item.step)) || null : null);
      if (normalized.step !== null && (normalized.step < 1 || normalized.step > 99)) {
        normalized.step = null;
      }
      normalized.title = item.title?.trim() || null;
      normalized.details = item.details?.trim() || '';
    }
    
    return normalized;
  }).filter(item => 
    ['documents', 'content', 'trademark'].includes(schemaName) 
      ? item.name && item.details 
      : schemaName === "faqs"
      ? item.question && item.answer
      : item.details
  );
};

const serviceStringFields = [
  "title",
  "subTitle",
  "slug",
  "heading",
  "description",
  "shortDescription",
  "fullDescription",
  "serviceIcon",
  "serviceBannerImage",
  "featuredImage",
  "serviceCategory",
  "status",
  "seoTitle",
  "metaDescription",
  "metaKeywords",
  "canonicalUrl",
  "openGraphTitle",
  "openGraphDescription",
  "openGraphImage",
  "schemaMarkupJson",
];

const pickServiceFields = (body) =>
  serviceStringFields.reduce((acc, field) => {
    if (body[field] !== undefined) {
      acc[field] = body[field]?.toString().trim() || "";
    }

    return acc;
  }, {});

export const createService = asyncHandler(async (req, res) => {
  const {
    title,
    subTitle,
    slug,
    heading,
    description = '',
    documents = [],
    process = [],
    processAtBriefcase = [],
    content = [],
    custom = [],
    trademark = [],
    faqs = [],
    prices = []                    
  } = req.body;

  const trimmed = {
    ...pickServiceFields(req.body),
    title: title?.trim(),
    subTitle: subTitle?.trim(),
    slug: slug?.trim().toLowerCase(),
    heading: heading?.trim(),
    description: description?.trim() || '',
    displayOrder: Number(req.body.displayOrder || 0),
  };

  if (!trimmed.title) return res.status(400).json({ error: 'title is required' });
  if (!trimmed.subTitle) return res.status(400).json({ error: 'subTitle is required' });
  if (!trimmed.slug) return res.status(400).json({ error: 'slug is required' });
  if (!trimmed.heading) return res.status(400).json({ error: 'heading is required' });

  const existing = await Service.findOne({ slug: trimmed.slug });
  if (existing) return res.status(409).json({ error: 'slug already exists' });

  const service = await Service.create({
    ...trimmed,
    documents: normalizeArray('documents', documents),
    process: normalizeArray('process', process),
    processAtBriefcase: normalizeArray('processAtBriefcase', processAtBriefcase),
    content: normalizeArray('content', content),
    custom: normalizeArray('custom', custom),
    trademark: normalizeArray('trademark', trademark),
    faqs: normalizeArray("faqs", faqs).sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
    ),
    prices: Array.isArray(prices) ? prices : []   
  });

  res.status(201).json(service);
});



export const listServices = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));
  const skip = (page - 1) * limit;

  const searchTerm = String(req.query.search || "").trim();
  const search = searchTerm
    ? {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { subTitle: { $regex: searchTerm, $options: "i" } },
          { heading: { $regex: searchTerm, $options: "i" } },
          { slug: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};
  const visibility =
    req.query.includeInactive === "true"
      ? {}
      : { status: { $ne: "Inactive" } };

  let items = await Service.find({ ...search, ...visibility })
    .select("-__v")
    .lean();

  // Custom document order sorting
  items.sort((a, b) => {
    const aName = a.heading || a.title || "";
    const bName = b.heading || b.title || "";
    const aIndex = serviceOrder.indexOf(aName);
    const bIndex = serviceOrder.indexOf(bName);

    if (aIndex === -1 && bIndex === -1) return aName.localeCompare(bName);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const total = items.length;

  // Pagination after sorting
  const paginatedItems = items.slice(skip, skip + limit);

  res.json({
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// GET BY ID
export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const item = await Service.findById(id).lean();
  if (!item) return res.status(404).json({ error: 'Service not found' });
  
  res.json(item);
});

export const updateService = asyncHandler(async (req, res) => {

  const { id } = req.params;

  /* ================= VALIDATE ID ================= */

  if (!mongoose.isValidObjectId(id)) {

    return res.status(400).json({
      error: "Invalid ID format",
    });

  }

  const updates = {};

  /* ================= SIMPLE STRING FIELDS ================= */

  const fields = serviceStringFields;

  fields.forEach((field) => {

    if (req.body[field] !== undefined) {

      updates[field] = req.body[field]?.trim() || "";

    }

  });

  if (req.body.displayOrder !== undefined) {
    updates.displayOrder = Number(req.body.displayOrder || 0);
  }

  /* ================= ARRAY FIELDS ================= */

  const arrayFields = [
    "documents",
    "process",
    "processAtBriefcase",
    "content",
    "custom",
    "trademark",
    "faqs",
  ];

  arrayFields.forEach((field) => {

    if (req.body[field] !== undefined) {

      updates[field] = normalizeArray(
        field,
        req.body[field]
      );

    }

  });

  /* ================= PRICES ================= */

  if (req.body.prices !== undefined) {

    updates.prices = Array.isArray(req.body.prices)

      ? req.body.prices.map((price) => ({

          amount:
            price.amount?.toString().trim() || "",

          type:
            price.type || "payment",

          features: Array.isArray(price.features)

            ? price.features.map((feature) =>
                feature.trim()
              )

            : [],

        }))

      : [];

  }

  /* ================= DUPLICATE SLUG ================= */

  if (updates.slug) {

    const existing = await Service.findOne({

      slug: updates.slug,

      _id: { $ne: id },

    });

    if (existing) {

      return res.status(409).json({
        error: "slug already exists",
      });

    }

  }

  /* ================= UPDATE SERVICE ================= */

  const item = await Service.findByIdAndUpdate(

    id,

    {
      $set: updates,
    },

    {
      new: true,
      runValidators: true,
    }

  );

  /* ================= NOT FOUND ================= */

  if (!item) {

    return res.status(404).json({
      error: "Service not found",
    });

  }

  /* ================= RESPONSE ================= */

  res.json(item);

});


export const updateimage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success:false, message:"Service not found" });
    }

    Object.assign(service, req.body);

    /* ADD NEW IMAGES */
    const files = Array.isArray(req.files?.images) ? req.files.images : [];

    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer);

      service.images.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        mimetype: file.mimetype
      });
    }

    await service.save();

    res.json({
      success:true,
      message:"Service updated",
      data:service
    });

  } catch (err) {
    next(err);
  }
};


// DELETE
export const deleteService = asyncHandler(async (req, routes) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const item = await Service.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ error: 'Service not found' });
  
  res.status(204).send();
});
