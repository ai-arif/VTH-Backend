import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    // quantity: {
    //   type: Number,
    //   required: true,
    // },
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
      required: true,
    },
    // composition: {
    //   type: String,
    //   required: true,
    // },
    class: {
      type: String,
      required: true,
    },
    form: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    // unitPrice: {
    //   type: Number,
    //   required: true,
    // },
    packSize: {
      type: String,
      required: true,
    },
    withdrawalPeriod: {
      type: String,
    },
    dose: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
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
