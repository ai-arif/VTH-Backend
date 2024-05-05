import { Schema, model } from "mongoose";

const patientRegistrationFormSchema = new Schema({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
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
    upazila: {
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
        enum: ['male', 'female'],
        trim: true,
        default: 'male'
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
    diseaseHistory: {
        type: String,
        trim: true,
    },
    treatmentHistory: {
        type: String,
        trim: true,
    },
    managementHistory: {
        type: String,
        trim: true,
    },
    clinicalSigns: {
        type: String,
        trim: true,
    },
    rectalPalpation: {
        type: String,
        trim: true,
    },
    laboratoryFindings: {
        type: String,
        trim: true,
    },
    diagnosis: {
        type: String,
        trim: true,
    },
    prognosis: {
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
