import { Schema, model } from "mongoose";

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

const Species = model("Species", speciesSchema);

export default Species;