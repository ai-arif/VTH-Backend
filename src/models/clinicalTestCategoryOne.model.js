import { Schema, model } from "mongoose";

const categoryWiseClinicalTestSchema = new Schema({
    category: {
        type: Number,
        required: true,
    },
    testName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    tests: [
        {
            test_subTitle: {
                type: String,
                trim: true,
                required: true,
            },
            parameter_title: {
                type: String,
                trim: true,
            },
            result_title: {
                type: String,
                trim: true,
            },
            unit_title: {
                type: String,
                trim: true,
            },
            range_title: {
                type: String,
                trim: true,
            },
            reference_titles: [{
                type: String,
                trim: true
            }],
            params: [
                {
                    param: {
                        type: String,
                        trim: true
                    },
                    result: {
                        type: String,
                        trim: true
                    },
                    unit: {
                        type: String,
                        trim: true
                    },
                    references: [{
                        type: String,
                        trim: true
                    }],

                }
            ]
        }
    ]


}, { timestamps: true });

const CategoryWiseClinicalTest = model("CategoryWiseClinicalTest", categoryWiseClinicalTestSchema);

export default CategoryWiseClinicalTest;