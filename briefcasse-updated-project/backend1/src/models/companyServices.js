import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DocumentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const IncoprationStepSchema = new Schema(
  {
    days: { type: String, trim: true },
    content: { type: String, trim: true },
  },
  { _id: false } 
);

const BriefCaseStepSchema = new Schema(
  {
    answer: { type: String, trim: true }, 
    content: { type: String, trim: true }, 
  },
  { _id: false }
);

const processStepSchema = new Schema(
  {
    name: { type: String, trim: true },
    value: { type: String, trim: true },
  },
  { _id: false }
);
const ItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true }, 
    subTitle: { type: String, trim: true, default: '' },
    heading: { type: String, trim: true, default: '' }, 
    description: { type: String, trim: true, default: '' },

    documents: { type: [DocumentSchema], default: [] }, 

    process: {
      incopration: { type: [IncoprationStepSchema], default: [] }, 
      processAtBriefCase: { type: [BriefCaseStepSchema], default: [] }, 
      stepBystep: { type: [processStepSchema], default: [] },
      _id: false
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export default model('Item', ItemSchema);



