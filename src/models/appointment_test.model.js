import { Schema, model } from "mongoose";

// const appointmentTestSchema = new Schema(
//   {
//     caseNo:Number,
//     test: [],
//   },

//   { timestamps: true }
// );

const appointmentTestSchema = new Schema({
  caseNo: Number,
  ownerName: String,
  phone: String,
  district: String,
  upazila: String,
  address: String,
  // date: Date,
  referred_doctor: String,
  test: [
    {
      testName: String,
      test_Id: {
        type: Schema.Types.ObjectId,
        ref: "ClinicalTest",
        required: true,
      },
      status: {
        type: Boolean,
        default: false
      }
    }
  ]
}, { timestamps: true });

const AppointmentTest = model("AppointmentTest", appointmentTestSchema);
export default AppointmentTest;
