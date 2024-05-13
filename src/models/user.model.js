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
    address: {
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
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },

  { timestamps: true }
);

const User = model("User", userSchema);

export { User };