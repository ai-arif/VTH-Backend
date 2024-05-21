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


// updated code 


// const testParameterSchema = new Schema(
//   {
//     name: String,
//     test: {
//       type: Schema.Types.ObjectId,
//       ref: "ClinicalTest",
//     },
//     parameters: [
//       {
//         parameterTitle: {
//           type: String,
//           required: true
//         },
//         isInputField: Boolean,
//         subParams: [
//           {
//             subParamTitle: String,
//             value: {
//               type: Schema.Types.Mixed,
//             },
//             additionalField: Boolean,
//             ifAdditionalTrue: [
//               {
//                 additionalFieldTitle: String,
//                 isAdditionalFieldInput: Boolean,
//                 additionalFieldValue: Schema.Types.Mixed
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   { timestamps: true }
// );


// Define sub parameter schema
// const SubParameterSchema = new Schema({
//   subParamTitle: String,
//   value: {
//     type: Schema.Types.Mixed,
//   },
//   additionalField: Boolean,
//   ifAdditionalTrue: [{
//     additionalFieldTitle: String,
//     isAdditionalFieldInput: Boolean,
//     additionalFieldValue: Schema.Types.Mixed
//   }]
// });

// // Define parameter schema
// const ParameterSchema = new Schema({
//   parameterTitle: {
//     type: String,
//     required: true
//   },
//   isInputField: Boolean,
//   subParams: [SubParameterSchema]
// });

// // Define test parameter schema
// const testParameterSchema = new Schema({
//   name: String,
//   test: {
//     type: Schema.Types.ObjectId,
//     ref: "ClinicalTest",
//   },
//   parameters: [ParameterSchema]
// }, { timestamps: true });

// const testParameterSchema = new Schema(
//   {
//     name: String,
//     test: {
//       type: Schema.Types.ObjectId,
//       ref: "ClinicalTest",
//     },
//     subParameter: [String]
//   },
//   { timestamps: true }
// );

const TestParameter = model("TestParameter", testParameterSchema);
export default TestParameter;
