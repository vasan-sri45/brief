import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name must be at most 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description too long']
    },
    // Option A: integer cents (recommended to avoid float issues)
    priceCents: {
      type: Number,
      min: [0, 'Price must be >= 0'],
      default: 0
    },
    // Option B: decimal price (uncomment if using Decimal128)
    // price: { type: Schema.Types.Decimal128, min: 0 },

    durationMinutes: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      default: 60
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // If using Decimal128 price: ret.price = ret.price ? Number(ret.price.toString()) : 0;
        return ret;
      }
    }
  }
);

// Helpful indexes for common queries
serviceSchema.index({ available: 1 });
serviceSchema.index({ priceCents: 1 }); // or { price: 1 } if using Decimal128

// Optional: text index for search on name/description
// serviceSchema.index({ name: 'text', description: 'text' });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
