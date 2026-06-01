import User from '../../models/auth/user.js';
import UserService from '../../models/services/user-services.js';
import Service from '../../models/serviceList.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import validator from 'validator';

// Add a service for a user
export const addUserService = asyncHandler(async (req, res) => {
  const { email, mobile, serviceId } = req.body;
  console.log('Received:', { email, mobile, serviceId }); // Debug

  // Basic credentials check
  if (!email || !mobile || !serviceId) {
    res.status(400);
    throw new Error('Missing credentials.');
  }

  // ID validation
  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    res.status(400);
    throw new Error('Invalid serviceId format.');
  }

  // Get user
  const user = await User.findOne({ email, mobile }).select('_id');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  // Get service
  const service = await Service.findById(serviceId).select('_id available');
  if (!service) {
    res.status(404);
    throw new Error('Service not found.');
  }
  if (service.available === false) {
    res.status(400);
    throw new Error('Service is not available.');
  }

  // Add service to user's list
  const filter = { user: user._id };
  const update = {
    $setOnInsert: { user: user._id },
    $addToSet: { services: { serviceId: service._id } }
  };
  const opts = { upsert: true, runValidators: true, setDefaultsOnInsert: true };

  const result = await UserService.updateOne(filter, update, opts);
  const cart = await UserService.findOne(filter);

  if (result.upsertedCount === 1) {
    return res.status(201).json({ success: true, message: 'Cart created and service added.', cart });
  }
  if (result.modifiedCount === 1) {
    return res.status(201).json({ success: true, message: 'Service added to cart.', cart });
  }
  return res.status(200).json({ success: true, message: 'Service already in cart.', cart });
});

// Get user services
export const getUserService = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;

  // Return only services
  const userServiceDoc = await UserService
    .findOne({ user: userId })
    .select('services -_id')
    .populate({
      path: 'services.serviceId',
      
    }).lean();

  if (!userServiceDoc) {
    return res.status(200).json({ success: true, services: [] });
  }
  return res.status(200).json({ success: true, services: userServiceDoc.services });
});

// Delete a user's service
export const deleteUserService = asyncHandler(async (req, res) => {
  let { email, mobile, serviceId } = req.body || {};
  email = typeof email === 'string' ? email.trim().toLowerCase() : '';
  mobile = typeof mobile === 'string' ? mobile.trim() : '';
  serviceId = typeof serviceId === 'string' ? serviceId.trim() : serviceId;

  if (!email || !mobile || !serviceId) {
    res.status(400);
    throw new Error('Missing credentials.');
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email address.');
  }
  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    res.status(400);
    throw new Error('Invalid serviceId format.');
  }

  const user = await User.findOne({ email, mobile }).select('_id');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const filter = { user: user._id, 'services.serviceId': serviceId };
  const update = { $pull: { services: { serviceId } } };
  const opts = { runValidators: true };

  const result = await UserService.updateOne(filter, update, opts);

  if (result.matchedCount === 0) {
    res.status(404);
    throw new Error('User services not found.');
  }
  if (result.modifiedCount === 0) {
    res.status(404);
    throw new Error('Service not found in user services.');
  }

  const updated = await UserService.findOne({ user: user._id }).select('services -_id').lean();
  return res.status(200).json({ success: true, message: 'Service removed successfully', services: updated?.services || [] });
});

