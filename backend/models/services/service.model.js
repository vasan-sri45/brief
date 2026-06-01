// models/service.model.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const processStepSchema = new mongoose.Schema(
  {
    days: { type: String, default: null },     // "1 - 2", "Day 1", etc.
    step: { type: Number, default: null },     // numbered steps or null
    title: { type: String, default: null },    // optional heading
    details: { type: String, required: true }  // main text
  },
  { _id: false }
);

const customizedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const trademarkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // "Startup", "Intellectual Property"
    subTitle: { type: String, required: true },     // "Company Registration", "Trademark"
    slug: { type: String, required: true, unique: true },

    heading: { type: String, required: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "", trim: true },
    fullDescription: { type: String, default: "", trim: true },
    serviceIcon: { type: String, default: "", trim: true },
    serviceBannerImage: { type: String, default: "", trim: true },
    featuredImage: { type: String, default: "", trim: true },
    serviceCategory: { type: String, default: "", trim: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
    seoTitle: { type: String, default: "", maxlength: 60, trim: true },
    metaDescription: { type: String, default: "", maxlength: 160, trim: true },
    metaKeywords: { type: String, default: "", trim: true },
    canonicalUrl: { type: String, default: "", trim: true },
    openGraphTitle: { type: String, default: "", trim: true },
    openGraphDescription: { type: String, default: "", trim: true },
    openGraphImage: { type: String, default: "", trim: true },
    schemaMarkupJson: { type: String, default: "", trim: true },
    faqs: { type: [faqSchema], default: [] },

    documents: { type: [documentSchema], default: [] },
    process: { type: [processStepSchema], default: [] },
    processAtBriefcase: { type: [processStepSchema], default: [] },
    content: {type: [contentSchema], default: []},
    custom:{type: [customizedSchema], default: []},
    trademark: {type: [trademarkSchema], default: []},
    // price: {type: String, default: null},
  prices: [
  {
    amount: {
      type: String,
      default: "",
    },
      type: {
      type: String,
      enum: ["payment", "contact"],
      default: "payment",
    },

    features: {
      type: [String],
      default: [],
    },
  },
],
    images: {
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
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
