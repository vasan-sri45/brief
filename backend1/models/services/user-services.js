import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const serviceItemSchema = new Schema({
  serviceId: {
    type: Types.ObjectId,
    ref: 'Item',
    required: true
  }
}, { _id: false });

const userServiceSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  services: {
    type: [serviceItemSchema],
    default: [],
    validate: {
      validator(arr) {
        const ids = arr.map(s => String(s.serviceId));
        return ids.length === new Set(ids).size;
      },
      message: 'Duplicate services are not allowed'
    }
  }
}, { timestamps: true });

// Helpful indexes
userServiceSchema.index({ user: 1 }, { unique: true });

const UserService = mongoose.model('UserService', userServiceSchema);
export default UserService;
