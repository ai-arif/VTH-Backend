import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
    caseNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    serialNumber: {
        type: String,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    registrationType: {
        type: String,
        required: true,
        enum: ["online", "offline"],
        default: "online",
    },
    appointmentDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    caseType: {
        type: String,
        enum: ["new", "old"],
        default: "new",
    },



},{ timestamps: true });

const Appointment = model("Appointment", appointmentSchema);
export default Appointment;
