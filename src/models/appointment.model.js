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
      required:true
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
        ref:'Department',
    },
    image:{
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription'
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


const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
