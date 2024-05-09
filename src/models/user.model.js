import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    upazila: {
      type: String,
      required: true,
      trim: true,
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    nid: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },

  { timestamps: true }
);

const User = model("User", userSchema);

export { User };