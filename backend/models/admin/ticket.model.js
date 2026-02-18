import mongoose from 'mongoose';
import Counter from './counter.model.js';

const ticketSchema = new mongoose.Schema({
  ticketNo: { type: String, unique: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
  department: { type: String, required: [true, 'Department is required.'], trim: true },
  requestType: { type: String, required: [true, 'Request type is required.'], trim: true },
  date: { type: Date, required: true },
  remark: { type: String, required: [true, 'Remark is required.'], trim: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open', index: true }
}, { timestamps: true });

// Helpful read indexes
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ createdBy: 1, createdAt: -1 });

// Auto-increment ticketNo (atomic via separate Counter collection)
ticketSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ticketNo' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    this.ticketNo = counter.sequence_value.toString().padStart(4, '0');
    next();
  } catch (err) {
    next(err);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;