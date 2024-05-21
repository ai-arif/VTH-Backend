import { Schema, model } from "mongoose";

const clinicalTestSchema = new Schema({
    testName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    testDetails: {
        type: String,
        trim: true,
    },
    parameters: [String] //  added by Mamun
}, { timestamps: true });

const ClinicalTest = model("ClinicalTest", clinicalTestSchema);

export default ClinicalTest;