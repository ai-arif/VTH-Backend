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
    nid: {
      type: String,
      trim: true,
    },
    age: {
      type: String,
      trim: true,
    },
    weight: {
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
    parity: {
      type: String,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    illnessDuration: {
      type: String,
      trim: true,
    },
    drags: {
      type: String,
      trim: true,
    },
    breading: {
      type: String,
      trim: true,
    },
    feedProvided: {
      type: String,
      trim: true,
    },
    vaccinations: {
      type: String,
      trim: true,
    },
    appetite: {
      type: String,
      trim: true,
    },
    rumination: {
      type: String,
      trim: true,
    },
    salvation: {
      type: String,
      trim: true,
    },
    lacrimation: {
      type: String,
      trim: true,
    },
    nasalDischarge: {
      type: String,
      trim: true,
    },
    dehydration: {
      type: String,
      trim: true,
    },
    mm: {
      type: String,
      trim: true,
    },
    respRate: {
      type: String,
      trim: true,
    },
    lacrimation: {
      type: String,
      trim: true,
    },
    temp: {
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
    species: {
      type: String,
      trim: true,
    },
    complaints: {
      type: String,
      trim: true,
    },
    sex: {
      type: String,
      trim: true,
    },
    pregnancyStatus: {
      type: String,
      trim: true,
    },
    treatedBefore: {
      type: String,
      trim: true,
    },
    confusionWords: {
      type: String,
      trim: true,
    },
    demeanour: {
      type: String,
      trim: true,
    },
    physicalCondition: {
      type: String,
      trim: true,
    },
    totalAnimals: {
      type: Number,
      trim: true,
    },
    totalSickAnimals: {
      type: Number,
      trim: true,
    },
    totalDeedAnimals: {
      type: Number,
      trim: true,
    },
    dop: {
      type: Date,
    },
    doo: {
      type: Date,
    },
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
