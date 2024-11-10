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
    division: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    upazila: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    numberOfAnimals: {
      type: Number,
      default: 1,
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
    ownerName: {
      type: String,
    },
    nid: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    payment: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    amount: {
      type: Number,
      default: 0,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    images: [String],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: "Prescription",
    },
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    species: {
      type: Schema.Types.ObjectId,
      ref: "Species",
      required: true,
    },
    breed: {
      type: Schema.Types.ObjectId,
      ref: "Breed",
      required: true,
    },
    complaint: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    hasPrescription: {
      type: Boolean,
      default: false,
    },
    // 23 October 2024
    age: {
      type: String,
      trim: true,
      required: true,
    },
    sex: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
      required: true,
    },
    illnessDuration: {
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

  },
  { timestamps: true }
);

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
