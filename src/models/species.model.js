import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const speciesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


const Species = models.Species || model("Species", speciesSchema);

export default Species;