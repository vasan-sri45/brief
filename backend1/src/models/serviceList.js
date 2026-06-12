import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  details: { type: String, required: true }
});

const ProcessStepSchema = new Schema({
  days: { type: String },           // For general process steps
  step: { type: Number },           // For numbered steps in briefcase process
  title: { type: String },          // For briefcase step titles
  details: { type: String, required: true }
});

const IndianSubsidiaryDocumentsSchema = new Schema({
  forDirectorsAndShareholders: [{ type: String }],
  forRegisteredOfficeInIndia: [{ type: String }],
  forParentCompany: [{ type: String }]
});

const CompanyRegistrationSchema = new Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  documents: {
    type: [DocumentSchema],
    required: function() { return !this.documentsForSubsidiary; }
  },
  documentsForSubsidiary: {
    type: IndianSubsidiaryDocumentsSchema,
    // required: function() { return !this.documents || this.documents.length === 0; }
  },
  process: { type: [ProcessStepSchema], required: true },
  processAtBriefcase: { type: [ProcessStepSchema], required: true }
});

export default model('CompanyRegistration', CompanyRegistrationSchema);


