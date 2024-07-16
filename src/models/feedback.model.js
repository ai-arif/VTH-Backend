import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const feedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;
