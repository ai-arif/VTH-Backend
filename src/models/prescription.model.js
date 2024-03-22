import { Schema, model } from "mongoose";

const prescriptionSchema = new Schema({
    patientReport: {
        type: Schema.Types.ObjectId,
        ref: "PatientReport",
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    medicine: {
        type: String,
        required: true,
        trim: true,
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true,
    },
    advice: {
        type: String,
        required: true,
        trim: true,
    },
    nextVisit: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;