import mongoose, { Schema } from "mongoose";

// Define the schema for the id field with dynamic keys
const dynamicSubSchema = new Schema({}, { strict: false });

// Define the main schema
const testResultSchema = new Schema({
    testId: { type: Schema.Types.ObjectId, ref: "ClinicalTest", required: true },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
    },
    prescriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    data: { type: dynamicSubSchema },
    status: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

// Create the model
const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;

