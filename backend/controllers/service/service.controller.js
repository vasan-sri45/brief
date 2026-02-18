import Service from '../../models/services/service.model.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

const normalizeArray = (schemaName, arr) => {
  if (!Array.isArray(arr)) return [];
  
  return arr.map(item => {
    const normalized = { ...item };
    
    if (['documents', 'content', 'trademark'].includes(schemaName)) {
      normalized.name = item.name?.trim() || '';
      normalized.details = item.details?.trim() || '';
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
      : item.details
  );
};

// CREATE
export const createService = asyncHandler(async (req, res) => {
  const {
    title, subTitle, slug, heading, description = '',
    documents = [], process = [], processAtBriefcase = [],
    content = [], trademark = []
  } = req.body;

  const trimmed = {
    title: title?.trim(),
    subTitle: subTitle?.trim(),
    slug: slug?.trim().toLowerCase(),
    heading: heading?.trim(),
    description: description?.trim() || ''
  };

  if (!trimmed.title) return res.status(400).json({ error: 'title is required' });
  if (!trimmed.subTitle) return res.status(400).json({ error: 'subTitle is required' });
  if (!trimmed.slug) return res.status(400).json({ error: 'slug is required' });
  if (!trimmed.heading) return res.status(400).json({ error: 'heading is required' });
  // if (!trimmed.description) return res.status(400).json({ error: 'description is required' });

  const existing = await Service.findOne({ slug: trimmed.slug });
  if (existing) return res.status(409).json({ error: 'slug already exists' });

  const service = await Service.create({
    ...trimmed,
    documents: normalizeArray('documents', documents),
    process: normalizeArray('process', process),
    processAtBriefcase: normalizeArray('processAtBriefcase', processAtBriefcase),
    content: normalizeArray('content', content),
    trademark: normalizeArray('trademark', trademark)
  });

  res.status(201).json(service);
});

// LIST (with search & pagination)
export const listServices = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));
  const skip = (page - 1) * limit;
  const search = req.query.search ? { $text: { $search: req.query.search } } : {};

  const [items, total] = await Promise.all([
    Service.find(search)
      .select('-__v')
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Service.countDocuments(search)
  ]);

  res.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
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

// UPDATE (PATCH)
export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updates = {};
  const fields = ['title', 'subTitle', 'slug', 'heading', 'description'];
  
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]?.trim() || '';
    }
  });

  const arrayFields = ['documents', 'process', 'processAtBriefcase', 'content', 'trademark'];
  arrayFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = normalizeArray(field, req.body[field]);
    }
  });

  if (updates.slug) {
    const existing = await Service.findOne({ 
      slug: updates.slug, 
      _id: { $ne: id } 
    });
    if (existing) return res.status(409).json({ error: 'slug already exists' });
  }

  const item = await Service.findByIdAndUpdate(
    id, 
    { $set: updates }, 
    { new: true, runValidators: true }
  );

  if (!item) return res.status(404).json({ error: 'Service not found' });
  res.json(item);
});

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
