import { Schema, model } from "mongoose";

const appointmentTestSchema = new Schema(
  {
    caseNo:Number,
    test: [],
  },

  { timestamps: true }
);

const AppointmentTest = model("AppointmentTest", appointmentTestSchema);
export default AppointmentTest;
