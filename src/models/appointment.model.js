import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    caseNo: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    date: {
      type: Date,
    },
    ownerName: {
      type: String,
    },
    district: {
      type: String,
      trim: true,
    },
    upazilla: {
      type: String,
      trim: true,
    },

    registrationType: {
      type: String,
      required: true,
      enum: ["online", "offline"],
      default: "online",
    },

    patientType: {
      type: String,
      enum: ["new", "old"],
      default: "new",
    },
    caseType: {
      type: String,
      enum: ["new", "old"],
      default: "new",
    },



},{ timestamps: true });

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
