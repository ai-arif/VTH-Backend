import { Schema, model } from "mongoose";

const departmentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        }
    },
    { timestamps: true }
);

const Department = model("Department", departmentSchema);

export default Department;