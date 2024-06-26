import { Schema, model } from "mongoose";

const adminSchema = new Schema(
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
    role: {
      type: String,
      enum: ["admin", "doctor", "lab", "pharmacy", "receptionist"],
      default: "lab",
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },

  },

  { timestamps: true }
);

const Admin = model("Admin", adminSchema);
export default Admin;

