import mongoose from 'mongoose';
import Ticket from '../../models/ticket.js';
import asyncHandler from 'express-async-handler';

const { Types } = mongoose;

// CREATE TICKET - User creates a new ticket
export const createTicket = asyncHandler(async (req, res) => {
  let { subject, message } = req.body || {};

  subject = typeof subject === 'string' ? subject.trim() : '';
  message = typeof message === 'string' ? message.trim() : '';

  if (!subject || !message) {
    res.status(400);
    throw new Error('Subject and message are required');
  }

  const createdBy = req.user?.id;
  if (!createdBy) {
    res.status(401);
    throw new Error('Authentication required');
  }

  const ticket = await Ticket.create({ subject, message, createdBy });

  res.status(201).json({ success: true, ticket });
});

// GET MY TICKETS - User fetches only their tickets
export const getMyTickets = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Authentication required');
  }

  const tickets = await Ticket.find({ createdBy: userId })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, tickets });
});

// GET ASSIGNED TICKETS - Employee fetches tickets assigned to them
export const getAssignedTickets = asyncHandler(async (req, res) => {
  const employeeId = req.user?.id;
  if (!employeeId) {
    res.status(401);
    throw new Error('Authentication required');
  }

  const tickets = await Ticket.find({ assignedTo: employeeId })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, tickets });
});

// GET ALL TICKETS - Admin fetches all tickets
export const getAllTickets = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }

  const tickets = await Ticket.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, tickets });
});

// ASSIGN TICKET - Admin assigns ticket to employee
export const assignTicket = asyncHandler(async (req, res) => {
  const { ticketId, employeeId } = req.body;

  if (!ticketId || !employeeId) {
    res.status(400);
    throw new Error('Ticket ID and Employee ID are required');
  }

  if (!Types.ObjectId.isValid(ticketId) || !Types.ObjectId.isValid(employeeId)) {
    res.status(400);
    throw new Error('Invalid ticketId or employeeId format');
  }

  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }

  const updated = await Ticket.findByIdAndUpdate(
    ticketId,
    { assignedTo: employeeId },
    { new: true }
  ).populate('assignedTo', 'name email');

  if (!updated) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.status(200).json({ success: true, ticket: updated });
});

// UPDATE ANY TICKET - Admin updates any ticket with filtered fields
export const updateAnyTicket = asyncHandler(async (req, res) => {
  const { ticketId, updates } = req.body;

  if (!ticketId || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
    res.status(400);
    throw new Error('Ticket ID and valid updates object are required');
  }

  if (!Types.ObjectId.isValid(ticketId)) {
    res.status(400);
    throw new Error('Invalid ticketId format');
  }

  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }

  const allowedFields = ['subject', 'message', 'assignedTo', 'status', 'priority'];
  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    res.status(400);
    throw new Error('No valid fields provided for update');
  }

  const updated = await Ticket.findByIdAndUpdate(ticketId, filteredUpdates, { new: true })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

  if (!updated) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.status(200).json({ success: true, ticket: updated });
});

// UPDATE ASSIGNED TICKET - Employee updates only their assigned tickets with filtered fields
export const updateAssignedTicket = asyncHandler(async (req, res) => {
  const { ticketId, updates } = req.body;

  if (!ticketId || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
    res.status(400);
    throw new Error('Ticket ID and valid updates object are required');
  }

  if (!Types.ObjectId.isValid(ticketId)) {
    res.status(400);
    throw new Error('Invalid ticketId format');
  }

  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error('Authentication required');
  }

  const ticket = await Ticket.findOne({ _id: ticketId, assignedTo: userId });
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found or not assigned to you.');
  }

  const allowedFields = ['status', 'message', 'priority', 'comments']; // Adjust fields as per your schema
  Object.keys(updates).forEach(key => {
    if (allowedFields.includes(key)) {
      ticket[key] = updates[key];
    }
  });

  await ticket.save();

  res.status(200).json({ success: true, ticket });
});
