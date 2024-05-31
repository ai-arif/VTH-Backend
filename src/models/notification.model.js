import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },
        type: {
            type: String,
            required: true,
            default: "general",
        },
        isViewed: {
            type: Boolean,
            default: false,
        },
        destinationUrl: {
            type: String,
            default: "/"
        }
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
export default Notification;