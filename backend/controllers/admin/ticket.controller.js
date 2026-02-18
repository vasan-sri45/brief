import mongoose from 'mongoose';
import Ticket from '../../models/admin/ticket.model.js';
// import Employee from '../../models/auth/employee.js';
import asyncHandler from "express-async-handler";

// Create
export const createTicket = asyncHandler(async (req, res) => {
  try {
    const { department, requestType, date, remark } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const createdBy = req.user._id; // ✅ FIX
    
    const dpt = String(department || '').trim();
    const rtype = String(requestType || '').trim();
    const rmk = String(remark || '').trim();
    const dt = new Date(date);

    if (!dpt || !rtype || !rmk || Number.isNaN(dt.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
      });
    }

    const ticket = await Ticket.create({
      department: dpt,
      requestType: rtype,
      date: dt,
      remark: rmk,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating ticket.',
    });
  }
});


// List my tickets
export const getMyTickets = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const tickets = await Ticket.find({
      createdBy: req.user._id, // ✅ FIX HERE
    })
      .select('ticketNo department requestType date remark status createdAt createdBy')
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name') // empId only if exists in schema
      .lean();

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tickets.',
    });
  }
};


// // Get ticket by ID with RBAC
export const getTicketById = async (req, res) => {
  try {
    const ticketId = (req.params.id || '').trim();

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ticket ID format: ${req.params.id}`,
      });
    }

    // 2️⃣ Fetch ticket
    const ticket = await Ticket.findById(ticketId)
      .populate('createdBy', 'empId name email role')
      .lean();

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // 3️⃣ Authorization (Owner OR Admin)
    const isOwner =
      String(ticket.createdBy?._id) === String(req.user._id);

    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ticket',
      });
    }

    // 4️⃣ Success
    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Get ticket by ID error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching ticket',
    });
  }
};


// // Update with RBAC
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    /* ================= VALIDATE ID ================= */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ticket ID format: ${id}`,
      });
    }

    /* ================= BUILD UPDATE OBJECT ================= */
    const updateFields = {};

    if (status) {
      updateFields.status = status;
    }

    if (remark !== undefined) {
      updateFields.remark = String(remark).trim();
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update fields provided',
      });
    }

    /* ================= FETCH TICKET ================= */
    const ticket = await Ticket.findById(id).select('createdBy');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    /* ================= AUTHORIZATION ================= */
    const isOwner =
      String(ticket.createdBy) === String(req.user._id);

    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this ticket',
      });
    }

    /* ================= UPDATE ================= */
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'empId name')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket,
    });
  } catch (error) {
    console.error('Update ticket error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while updating ticket',
    });
  }
};


// // Delete with RBAC
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ticket ID format: ${id}`,
      });
    }

    // 2️⃣ Find ticket
    const ticket = await Ticket.findById(id).select('createdBy');
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // 3️⃣ Authorization (Owner OR Admin)
    const isOwner = String(ticket.createdBy) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this ticket',
      });
    }

    // 4️⃣ HARD DELETE (PERMANENT)
    await Ticket.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Ticket permanently deleted',
      ticketId: id,
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting ticket',
    });
  }
};



// // Admin: list all tickets
export const getAllTickets = async (req, res) => {
  try {
    // 🔐 Admin guard
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required',
      });
    }

    const tickets = await Ticket.find()
      .select('ticketNo department requestType date remark status createdAt createdBy')
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email') // empId only if exists in schema
      .lean();

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tickets.',
    });
  }
};
