import { Schema, model } from "mongoose";

const patientRegistrationFormSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    date: {
      type: Date,
      required: true,
    },
    species: {
      type: String,
      trim: true,
      required: true,
    },
    complaints: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: String,
      trim: true,
      required: true,
    },
    breed: {
      type: String,
      trim: true,
      required: true,
    },
    illnessDuration: {
      type: String,
      trim: true,
      required: true,
    },
    drags: {
      type: String,
      trim: true,
      required: true,
    },
    breading: {
      type: String,
      trim: true,
      required: true,
    },
    feedProvided: {
      type: String,
      trim: true,
      required: true,
    },
    vaccinations: {
      type: String,
      trim: true,
      required: true,
    },
    appetite: {
      type: String,
      trim: true,
      required: true,
    },
    salvation: {
      type: String,
      trim: true,
      required: true,
    },
    lacrimation: {
      type: String,
      trim: true,
      required: true,
    },
    nasalDischarge: {
      type: String,
      trim: true,
      required: true,
    },
    respRate: {
      type: String,
      trim: true,
      required: true,
    },
    pulseRate: {
      type: String,
      trim: true,
      required: true,
    },
    temp: {
      type: String,
      trim: true,
      required: true,
    },
    sex: {
      type: String,
      trim: true,
      required: true,
    },
    treatedBefore: {
      type: String,
      trim: true,
      required: true,
    },
    confusionWords: {
      type: String,
      trim: true,
      required: true,
    },
    demeanour: {
      type: String,
      trim: true,
      required: true,
    },
    physicalCondition: {
      type: String,
      trim: true,
      required: true,
    },
    totalAnimals: {
      type: Number,
      trim: true,
      required: true,
    },
    totalSickAnimals: {
      type: Number,
      trim: true,
      required: true,
    },
    totalDeadAnimals: {
      type: Number,
      trim: true,
      required: true,
    },
    totalMortality: {
      type: Number,
      trim: true,
      required: true,
    },
    totalFatality: {
      type: Number,
      trim: true,
      required: true,
    },
    nid: {
      type: String,
      trim: true,
    },
    bcs: {
      type: String,
      trim: true,
    },
    milkYield: {
      type: String,
      trim: true,
    },
    pregnancyStatus: {
      type: String,
      trim: true,
    },
    parity: {
      type: String,
      trim: true,
    },
    rumination: {
      type: String,
      trim: true,
    },
    dehydration: {
      type: String,
      trim: true,
    },
    rumenMotility: {
      type: String,
      trim: true,
    },
    others: {
      type: String,
      trim: true,
    },
    dop: {
      type: Date,
    },
    doo: {
      type: Date,
    },
    totalTestCost: {
      // to do
      type: Number,
      default: 0.0,
    },
    testStatus: {
      type: String,
      enum: ["pending", "processing", "success"],
      default: "pending",
    },
    tests: [
      {
        type: Schema.Types.ObjectId,
        // old ref
        // ref: "ClinicalTest",
        ref: "CategoryWiseClinicalTest",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const PatientRegistrationForm = model(
  "PatientRegistrationForm",
  patientRegistrationFormSchema
);

export default PatientRegistrationForm;
