import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    image: {
      type: String,
    },
    enable: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: String,
      required: true,
      default: "image",
    },
  },
  {
    timestamps: true,
  }
);

const Content = model("Content", contentSchema);

export default Content;
