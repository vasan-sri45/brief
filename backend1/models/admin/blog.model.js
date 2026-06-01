import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true, // ensures unique index in MongoDB (when autoIndex is on)
      lowercase: true,
      trim: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      // optional: hide from lightweight list queries, use .select('+content') when needed
      // select: false,
    },

    /* ================= DOCUMENTS (FILES) ================= */
    documents: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },
          publicId: {
            type: String,
            default: null,
          },
          originalName: {
            type: String,
            required: true,
            trim: true,
          },
          mimetype: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      default: [], // or `undefined` if you prefer it truly optional
      // default: undefined,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    /* ================= ADMIN ================= */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      index: true,
    },

    /* ================= META ================= */
    views: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= INDEXES ================= */

// Full-text search on title & content
blogSchema.index({ title: "text", content: "text" });

// Sort by newest first
blogSchema.index({ createdAt: -1 });

// Common query pattern: only non-deleted, published posts sorted by createdAt
blogSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

/* ================= SAFE EXPORT ================= */
const Blog =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
