import { Schema, model } from "mongoose";

const breedSchema = new Schema(
  {
    species: {
      type: Schema.Types.ObjectId,
      ref: "Species",
      required: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Breed = model("Breed", breedSchema);
export default Breed;
