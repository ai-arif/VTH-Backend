import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
    {
        name: {
        type: String,
        required: true,
        trim: true,
        },
        price: {
        type: Number,
        required: true,
        },
        quantity: {
        type: Number,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
        createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
        },
    },
    { timestamps: true }
    );

const Medicine = model("Medicine", medicineSchema);

export default Medicine;