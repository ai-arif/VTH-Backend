import mongoose, { Schema } from "mongoose";

// Define the schema for the id field with dynamic keys
const dynamicSubSchema = new Schema({}, { strict: false });

// Define the main schema
const testResultSchema = new Schema({
    testId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    data: { type: dynamicSubSchema }
}, { timestamps: true });

// Create the model
const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;


// {
//     "Gestation sac param#Absent": false,
//         "Gestation sac param#Present": true,
//             "Gestation sac param#Present&Rt horn": true,
//                 "Gestation sac param#Present&Lt horn": true,
//                     "Gestation sac param#Present&Number": "20",
//                         "Gestation sac param#input sub": "param sub 2",
//                             "Gestation sac param#none": true,
//                                 "param-2#sub-text": "param sub 2 of 2",
//                                     "param-2#Absence": true,
//                                         "param-2#Present": false
// }

// const a = {
//     "Gestation sac param": [
//         { Absent: false },
// {
//     Present: true, "Present&": [
//         { "Rt horn": true },
//         { "Lt horn": true },
//         { Number: 20 },
//     ]
// },

//         { "input sub": "param sub 2}" },
//         { none: true },

//     ],

//     "param-2": [
//         { Absence: true },
//         { Present: false },
//     ]

// }

// example-1
// -----------
// Present: [
//     {Normal: false},
//     {Abnormal: true}
// ]
// example-2
// -----------
// Present: [
//     {Normal: false},
//     {Abnormal: ""}
// ]
// example-3
// -----------
// Present: [
//     {Normal: false},
//     {Abnormal: "20x"}
// ]

