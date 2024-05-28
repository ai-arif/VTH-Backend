import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    isDeletedForPharmacy: {
      type: Boolean,
      default: false
    },
    takesMedicinesBefore: {
      type: Boolean,
      default: false
    },
    caseNo: Number,
    date: {
      type: Date,
      default: Date.now(),
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    medicines: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    diagnosis: {
      type: String,
    },
    therapeutics: {
      type: String,
    },
    prognosis: {
      type: String,
    },
    advice: {
      type: String,
    },
    nextVisit: {
      type: Date,
    },
    testStatue: {
      type: Boolean,
      default: false,
    },
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: "ClinicalTest",
      },
    ],
  },
  { timestamps: true }
);

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
