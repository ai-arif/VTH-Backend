import { Schema, model } from "mongoose";

const clinicalTestSchema = new Schema({
    testName: {
        type: String,
        required: true,
        trim: true,
    },
    testDetails:{
        type: String,
        trim: true,
    },
},{ timestamps: true });

const ClinicalTest = model("ClinicalTest", clinicalTestSchema);

export default ClinicalTest;