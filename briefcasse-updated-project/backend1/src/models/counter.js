// models/counter.js
import mongoose from 'mongoose';
const CounterSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true }, // unique key for sequence [web:101]
  seq: { type: Number, default: 0 }
}, { timestamps: false });

export default mongoose.model('Counter', CounterSchema);
