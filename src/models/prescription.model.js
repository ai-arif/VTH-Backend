import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    isDeletedForPharmacy: {
      type: Boolean,
      default: false,
    },
    takesMedicinesBefore: {
      type: Boolean,
      default: false,
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
    prescribedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
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
    therapeutics: [],
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
      type: String,
      enum: ["pending", "processing", "success"],
      default: "pending",
    },
    totalTestCost: {
      // to do
      type: Number,
      default: 0.0,
    },
    // tests: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "ClinicalTest",
    //   },
    // ],
    preAnestheticUsed: {
      type: String,
      // required: true,
    },
    sutureMaterialsUsed: {
      type: String,
      // required: true,
    },
    typeOfSurgery: {
      type: String,
      // required: true,
    },
    postOperativeCare: {
      type: String,
      // required: true,
    },
    briefSurgical: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
