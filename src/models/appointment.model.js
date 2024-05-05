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

    serialNumber: {
      type: Number,
    },

    phone: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    department: {
        type: Schema.Types.ObjectId,
        ref:'Department',
    },
   
  },
  { timestamps: true }
);


const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
