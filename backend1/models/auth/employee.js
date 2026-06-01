// models/employee.js
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,                
      lowercase: true,             
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Please enter a valid email address.',
      },
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required.'],
      unique: true,                
      trim: true,
      validate: {
        validator: (v) => validator.isMobilePhone(v, 'any', { strictMode: false }),
        message: 'Please enter a valid mobile number.',
      },
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      select: false,               // do not return by default
    },
    forgotPasswordOTP: {
      type: String,
      select: false,
    },
    forgotPasswordExpires: {
      type: Date,
      select: false
    },
  },
  {
    timestamps: true,
    // Optional: clean API responses
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Pre-save hashing (only if modified/new)
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);  // 10–12 recommended
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method for login
employeeSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Optional: hash on findOneAndUpdate when password is provided
employeeSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (!update) return next();

  // Support $set or direct assignment
  const pwd = update.password ?? update.$set?.password;
  if (!pwd) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pwd, salt);
    if (update.$set?.password !== undefined) update.$set.password = hashed;
    else update.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// Model & indexes auto-created by default; disable in prod if needed
// via mongoose.set('autoIndex', false) and manage indexes manually.
const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
