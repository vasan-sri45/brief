// import mongoose from 'mongoose';
// import Counter from './counter.js';
// const { Schema } = mongoose;

// const sellingReportSchema = new Schema(
//   {
//     name: { type: String, required: true }, // customer or ticket name [web:3]
//     serviceNum: { type: String}, // external id [web:3]
//     serviceType: { type: String, required: true }, // category [web:3]
//     serviceItems: [
//       { type: Schema.Types.ObjectId, ref: 'CompanyRegistration', required: true } // array of refs [web:19]
//     ], // reference [web:19][web:3]
//     modeOfPayment: { type: String, required: true }, // cash/card/upi [web:3]
//     totalPayment: { type: Number, required: true, min: 0}, // amount [web:3]
//     status: {
//       type: String,
//       enum: ['open', 'closed', 'resolved'],
//       default: 'open',
//       // required: true
//     }, // enum + default [web:4][web:2]
//     assigned: {
//       type: String,
//       enum: ['availed', 'not availed'],
//       default: 'availed',
//       // required: true
//     } // enum + default [web:4][web:2]
//     // NOTE: no createdAt here because timestamps adds it [web:15]
//   },
//   { timestamps: true }
// );

// sellingReportSchema.pre('save', async function(next) {
//   try {
//     if (!this.isNew || this.serviceNum) return next(); // only on first save [web:76]
//     const updated = await Counter.findOneAndUpdate(
//       { key: 'SERVICE_NUM' },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     ); // atomic increment + upsert [web:74]
//     this.serviceNum = `SRV-${new Date().getFullYear()}-${String(updated.seq).padStart(5,'0')}`; // padded seq [web:92]
//     return next();
//   } catch (err) {
//     return next(err); // stop save on error [web:76]
//   }
// });

// export default mongoose.model('SellingReport', sellingReportSchema);



import mongoose from 'mongoose';
import Counter from './counter.js';

const { Schema } = mongoose;

const sellingReportSchema = new Schema(
  {
    name: { type: String, required: true }, // [web:2]
    serviceNum: { type: String, index: true, unique: true }, // unique service number [web:2][web:101]
    serviceItems: [
      { type: Schema.Types.ObjectId, ref: 'CompanyRegistration', required: true }
    ], // array of refs [web:27][web:19]
    modeOfPayment: { type: String, required: true }, // [web:2]
    totalPayment: { type: Number, required: true, min: 0 }, // [web:2]
    status: {
      type: String,
      enum: ['open','closed','resolved'],
      default: 'open'
    }, // enum + default [web:2]
    assigned: {
      type: String,
      enum: ['availed','not availed'],
      default: 'availed'
    } // enum + default [web:2]
  },
  { timestamps: true }
);

sellingReportSchema.path('serviceItems').validate(
  arr => Array.isArray(arr) && arr.length > 0,
  'At least one service item required'
); // [web:3]

// Generate serviceNum before validation
sellingReportSchema.pre('validate', async function(next) {
  try {
    if (this.serviceNum) return next(); // skip if already set [web:76]
    const updated = await Counter.findOneAndUpdate(
      { key: 'SERVICE_NUM' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ); // atomic increment [web:113][web:74]
    this.serviceNum = `SRV-${new Date().getFullYear()}-${String(updated.seq).padStart(5,'0')}`;
    next();
  } catch (err) {
    next(err); // stop save on error [web:76]
  }
});

// DB-level uniqueness
sellingReportSchema.index({ serviceNum: 1 }, { unique: true }); 

export default mongoose.model('SellingReport', sellingReportSchema);
