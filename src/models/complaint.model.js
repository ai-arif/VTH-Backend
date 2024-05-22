import { Schema, model } from "mongoose";

const complaintSchema = new Schema(
    {
        species: {
            type: Schema.Types.ObjectId,
            ref: "Species",
            required: true,
        },
        complaint: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);