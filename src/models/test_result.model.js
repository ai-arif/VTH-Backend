// import mongoose, { Schema } from "mongoose";

// // Define the schema for the id field with dynamic keys
// const dynamicSubSchema = new Schema({}, { strict: false });

// // Define the main schema
// const testResultSchema = new Schema({
//     testId: { type: Schema.Types.ObjectId, ref: "ClinicalTest", required: true },
//     appointmentId: {
//         type: Schema.Types.ObjectId,
//         ref: "Appointment",
//     },
//     prescriptionId: {
//         type: Schema.Types.ObjectId,
//         ref: "Prescription",
//     },
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     data: { type: dynamicSubSchema },
//     status: {
//         type: Boolean,
//         default: false
//     },
// }, { timestamps: true });

// // Create the model
// const TestResult = mongoose.model('TestResult', testResultSchema);
// export default TestResult;

// updated code test result ||-->-->-->-->--------------------------->|
//********************************************************************/
import mongoose, { Schema } from "mongoose";

// Define the schema for the id field with dynamic keys
const dynamicSubSchema = new Schema({}, { strict: false });

// Define the main schema
const testResultSchema = new Schema(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: "CategoryWiseClinicalTest",
      required: true,
    },
    testedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "PatientRegistrationForm",
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    data: { type: dynamicSubSchema },
    interpretation: String,
    lab_technician: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    isDeletedForLab: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0.0,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create the model
const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
