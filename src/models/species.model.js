import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const speciesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Species = models.Species || model("Species", speciesSchema);

export default Species;
