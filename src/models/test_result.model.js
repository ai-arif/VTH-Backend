import mongoose, { Schema } from "mongoose";

// Define the schema for the id field with dynamic keys
const dynamicSubSchema = new Schema({}, { strict: false });

// Define the main schema
const testResultSchema = new Schema({
    testId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    phone: { type: String, required: true },
    data: { type: dynamicSubSchema }
}, { timestamps: true });

// Create the model
const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;