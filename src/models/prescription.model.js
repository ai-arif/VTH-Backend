import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    caseNo: Number,
    date: {
      type: Date,
      default: Date.now(),
    },
    medicine: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
      }
    ],
    diagnosis: {
      type: String,      
    },
    advice: {
      type: String,
    },
    nextVisit: {
      type: Date,
    },
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Test'
      }
    ]
  },
  { timestamps: true }
);

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
