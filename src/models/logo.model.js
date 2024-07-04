import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const logoSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Logo = model("Logo", logoSchema);

export default Logo;
