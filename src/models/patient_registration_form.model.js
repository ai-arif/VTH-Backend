import { Schema, model } from "mongoose";

const patientRegistrationFormSchema = new Schema({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
    },
    caseNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    date: {
        type: Date,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    village: {
        type: String,
        required: true,
        trim: true,
    },
    district: {
        type: String,
        required: true,
        trim: true,
    },
    upazilla: {
        type: String,
        required: true,
        trim: true,
    },
    nid: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    attendeeInfo: {
        type: String,
        required: true,
        trim: true,
    },
    tagNo: {
        type: String,
        required: true,
        trim: true,
    },
    patientName: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    identificationMark: {
        type: String,
        required: true,
        trim: true,
    },
    species: {
        type: String,
        required: true,
        trim: true,
    },
    breed: {
        type: String,
        required: true,
        trim: true,
    },
    sex: {
        type: String,
        enum: ['male','female'],
        trim: true,
        default:'male'
    },
    weight: {
        type: Number,
        required: true,
    },
    milkYield: {
        type: Number,
    },
    registrationType: {
        type: String,
        required: true,
        enum: ["online", "offline"],
        default: "online",
    },
    patientType: {
        type: String,
        required: true,
        enum: ["new", "old"],
        default: "new",
    },
    caseType: {
        type: String,
        required: true,
        enum: ["new", "old"],
        default: "new",
    },
    patientComplaint: {
        type: String,
        trim: true,
    },
    pregnancyStatus: {
        type: Boolean,
        default: false,
    },
    serviceRequested: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
    },
},{ timestamps: true });

const PatientRegistrationForm = model("PatientRegistrationForm", patientRegistrationFormSchema);

export default PatientRegistrationForm;
