import { Schema, model } from "mongoose";

const testParameterSchema = new Schema(
  {
    name: String,
    test: {
      type: Schema.Types.ObjectId,
      ref: "ClinicalTest",
    },
  },
  { timestamps: true }
);

const TestParameter = model("TestParameter", testParameterSchema);
export default TestParameter;
