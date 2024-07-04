import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const medicineParamsSchema = new Schema(
  {
    param_category: {
      type: String,
      required: true,
    },
    param_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedicineParams = model("MedicineParams", medicineParamsSchema);

export default MedicineParams;
