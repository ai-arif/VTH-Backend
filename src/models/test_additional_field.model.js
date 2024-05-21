import { Schema, model } from "mongoose";

const AdditionalFieldSchema = new Schema({
    additionalFieldTitle: String,
    isAdditionalFieldInput: Boolean,
    additionalFieldValue: Schema.Types.Mixed,
    sub_test_parameter: {
        type: Schema.Types.ObjectId,
        ref: "TestSubParameter",
    }
}, { timestamps: true })
const TestAdditionalField = model("TestAdditionalField", AdditionalFieldSchema);
export default TestAdditionalField;