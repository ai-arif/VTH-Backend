
import Pharmacy from "../../models/pharmacy.model.js";
import Prescription from "../../models/prescription.model.js";
import sendResponse from "../../utils/sendResponse.js";




//Create order from pharmacy
export const CreateOrder = async (req, res) => {
    try {
        const order = new Pharmacy(req.body);
        const result = await order.save();

        if (result) {
            const updatePrescriptionStatus = await Prescription.findByIdAndUpdate(req.body?.prescriptionID, { $set: { takesMedicinesBefore: true } }, { new: true })
            return sendResponse(res, 200, true, "Order successfully", result);
        }

        return sendResponse(res, 500, false, "Unable to create order!");

    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, error.message);
    }
}


// Read All Prescriptions
export const FindAllPrescriptions = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = -1;

    const totalPrescription = await Prescription.find().select("_id");
    const totalPages = Math.ceil(totalPrescription.length / limit);

    try {
        const prescriptions = await Prescription.aggregate([
            {
                $lookup: {
                    from: "appointments", // Name of the collection you're joining with
                    localField: "appointment", // Field from the Prescription collection
                    foreignField: "_id", // Field from the Appointment collection
                    as: "appointment" // Alias for the joined data
                }
            },
            {
                $unwind: "$appointment" // Unwind the array to denormalize the data
            },
            {
                $project: {
                    caseNo: 1,
                    takesMedicinesBefore: 1,
                    medicines: 1,
                    date: 1,
                    tests: 1,
                    medicinesCount: { $size: "$medicines" },
                    appointment: 1 // Include the full appointment data
                }
            },
            {
                $sort: { date: sort }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);



        return sendResponse(res, 200, true, "Prescriptions successfully retrieved", {
            data: prescriptions,
            totalPages,
            currentPage: page,
            totalPrescriptions: totalPrescription.length
        });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

//read all pharmacy orders
export const FindAllOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = -1;
    //   const search = req.query.search;

    try {
        const totalOrders = await Pharmacy.find().select("_id");
        const totalPages = Math.ceil(totalOrders.length / limit);

        const orders = await Pharmacy.find().limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: sort });
        return sendResponse(res, 200, true, "Orders successfully retrieved", { data: orders, totalOrders: totalOrders.length, totalPages, currentPage: page });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

// Read Prescription by ID
export const FindOrderById = async (req, res) => {
    try {
        const order = await Pharmacy.findById(req.params.id);

        if (!order) {
            return sendResponse(res, 404, false, "Order did not found");

        }
        return sendResponse(res, 200, true, "Order fetched successfully", { data: order });

    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


// Update Pharmacy order
export const UpdateOrderById = async (req, res) => {
    try {
        const updatedData = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedData) {
            return sendResponse(res, 404, false, "Order did not found");
        }
        return sendResponse(res, 200, true, "Order updated successfully");

    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


// Delete pharmacy order
export const DeleteOrderById = async (req, res) => {
    try {
        const result = await Pharmacy.findByIdAndDelete(req.params.id);
        if (!result) {
            return sendResponse(res, 404, false, "Order did not found");
        }
        return sendResponse(res, 200, true, "Order deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

// delete prescription for pharmacy order
export const deletedForPharmacy = async (req, res) => {
    try {
        const updatedData = await Prescription.findByIdAndUpdate(req.params.id, { $set: { isDeletedForPharmacy: true } }, { new: true });
        if (!updatedData) {
            return sendResponse(res, 404, false, "Unable to delete prescription!");
        }
        return sendResponse(res, 200, true, "Successfully deleted prescription for pharmacy");

    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}



