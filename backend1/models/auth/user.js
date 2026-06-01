// models/user.js
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,           // DB-level unique index
    lowercase: true,        // normalize for consistent uniqueness
    trim: true,
    validate: {            
      validator: (v) => validator.isEmail(v),
      message: 'Please enter a valid email address.'
    }
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required.'],
    unique: true,           // DB-level unique index
    trim: true,
    validate: {
      validator: (v) => validator.isMobilePhone(v, 'any', { strictMode: false }),
      message: 'Please enter a valid mobile number.'
    }
  },
  role:{
    type: String,
    default: "user"
  },
  accountType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  businessName: {
    type: String,
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long.'],
    required: function () { return this.accountType === 'business'; }
  },
  businessType: {
    type: String,
    trim: true,
    required: function () { return this.accountType === 'business'; },
    enum: ['Retail', 'Service', 'Manufacturing', 'Other']
  },
  otp: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.otp;
      delete ret.otpExpires;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.otp;
      delete ret.otpExpires;
      return ret;
    }
  }
});

// Explicit indexes (MongoDB enforces uniqueness)
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ mobile: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;


