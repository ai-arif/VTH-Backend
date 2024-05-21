import { Schema, model } from "mongoose";

// const testSubParameterSchema = new Schema(
//   {
//     sub_parameter_type: {
//       type: String,
//       enum: ["text", "check"],
//       default: "text",
//     },
//     text: String,
//     check: String,
//     test_parameter: {
//       type: Schema.Types.ObjectId,
//       ref: "TestParameter",
//     },
//   },
//   { timestamps: true }
// );

// const TestSubParameter = model("TestSubParameter", testSubParameterSchema);
// export default TestSubParameter;


// Define parameter schema
const SubParameterSchema = new Schema({
  title: String,
  isInputField: Boolean,
  value: {
    type: Schema.Types.Mixed,
  },
  test_parameter: {
    type: Schema.Types.ObjectId,
    ref: "TestParameter",
  }
  // additionalFields: [String]
}, { timestamps: true });

const TestSubParameter = model("TestSubParameter", SubParameterSchema);
export default TestSubParameter;

