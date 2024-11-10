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
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    division: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    upazila: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    nid: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User = model("User", userSchema);

export { User };

