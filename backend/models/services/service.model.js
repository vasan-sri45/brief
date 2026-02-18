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

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // "Startup", "Intellectual Property"
    subTitle: { type: String, required: true },     // "Company Registration", "Trademark"
    slug: { type: String, required: true, unique: true },

    heading: { type: String, required: true },
    description: { type: String, default: "" },

    documents: { type: [documentSchema], default: [] },
    process: { type: [processStepSchema], default: [] },
    processAtBriefcase: { type: [processStepSchema], default: [] },
    content: {type: [contentSchema], default: []},
    trademark: {type: [trademarkSchema], default: []},
    price: {type: String, default: null}
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
