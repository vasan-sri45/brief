import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,   // e.g. "serviceNo"
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter =
  mongoose.models.Counters || mongoose.model("Counters", counterSchema);

export default Counter;
