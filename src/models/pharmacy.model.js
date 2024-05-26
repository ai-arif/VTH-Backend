import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const pharmacySchema = new Schema({
    prescriptionID: {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
    },
    availableMedicines: [
        {
            medicineName: String,
            unitPrice: Number,
            quantity: Number,
        }
    ],
    unavailableMedicines: [
        {
            medicineName: String,
            unitPrice: Number,
            quantity: Number,
        }
    ],
    subTotal: Number,
    discount: Number,
    totalPrice: Number,
}, { timestamps: true });

const Pharmacy = model("Pharmacy", pharmacySchema);
export default Pharmacy;
