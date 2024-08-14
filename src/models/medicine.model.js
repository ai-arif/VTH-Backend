import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    brandName: {
      type: String,
      required: false,
    },
    // composition: {
    //   type: String,
    //   required: true,
    // },
    class: {
      type: String,
      required: false,
    },
    form: {
      type: String,
      required: false,
    },
    manufacturer: {
      type: String,
      required: false,
    },
    // unitPrice: {
    //   type: Number,
    //   required: true,
    // },
    packSize: {
      type: String,
      required: false,
    },
    withdrawalPeriod: {
      type: String,
    },
    dose: {
      type: String,
      required: false,
    },
    route: {
      type: String,
      required: false,
    },
    // strength: {
    //   type: String,
    //   required: true,
    // },
    // animalType: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const Medicine = model("Medicine", medicineSchema);

export default Medicine;
