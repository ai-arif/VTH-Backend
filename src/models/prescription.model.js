import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    caseNo: Number,
    date: {
      type: Date,
      default: Date.now(),
    },
    medicine: {
      type: [],
    },
    diagnosis: {
      type: [],
    },
    advice: {
      type: String,
    },
    nextVisit: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
