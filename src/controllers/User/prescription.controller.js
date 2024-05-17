import Prescription from "../../models/prescription.model.js";
import sendResponse from "../../utils/sendResponse.js";

// get all prescriptions with pagination and populate appointment and department, with decending order
export const getAllPrescriptions = async (req, res) => {
    try {
        // send with total pages
        const limit = parseInt(req.query.limit) || 15;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sort = -1;
        const prescriptions = await Prescription.find()
            .populate({
                path: 'appointment',
                populate: {
                    path: 'department',
                    model: 'Department'
                }
            })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: sort });

        const count = await Prescription.countDocuments();
        const totalPages = Math.ceil(count / limit);

        sendResponse(res, 200, true, "Showing results", { prescriptions, totalPages });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};