import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    default: "",
  },

  seq: {
    type: Number,
    default: 0,
  },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export default Counter;
