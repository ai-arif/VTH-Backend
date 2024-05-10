import { Schema, model } from "mongoose";

const testSubParameterSchema = new Schema(
  {
    sub_parameter_type: {
      type: String,
      enum: ["text", "check"],
      default: "text",
    },
    text: String,
    check: String,
    test_parameter: {
      type: Schema.Types.ObjectId,
      ref: "TestParameter",
    },
  },
  { timestamps: true }
);

const TestSubParameter = model("TestSubParameter", testSubParameterSchema);
export default TestSubParameter;
