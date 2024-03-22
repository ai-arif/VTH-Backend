import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },

  },

  { timestamps: true }
);

const User = model("User", userSchema);
export default User;