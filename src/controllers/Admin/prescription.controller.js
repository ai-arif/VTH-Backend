import Prescription from "../../models/prescription.model.js";
import sendResponse from "../../utils/sendResponse.js";


//Create Prescription
export const Create = async(req, res) => {
    try {
        const prescription = new Prescription(req.body);
        await prescription.save();
        sendResponse(res, 200, true, "Prescription successfully");
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}


// Read All Prescriptions
export const Find = async (req, res) => {
    try {
        const prescriptions = await Prescription.find()
            .populate({
                path: 'appointment',
                populate: {
                    path: 'department',
                    model: 'Department'
                }
            });
        sendResponse(res, 200, true, "Prescriptions successfully retrieved", { data: prescriptions });
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}



// Read Prescription by ID
export const FindBy =  async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id).populate({
            path: 'appointment',
            populate: {
                path: 'department',
                model: 'Department'
            }
        });
        if (!prescription) {
            sendResponse(res, 404, false, "Prescription did not found");

        }
        sendResponse(res, 200, true, "Prescription fetched successfully",{data: prescription});

    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}


// Update Prescription
export const Updateby = async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!prescription) {
            sendResponse(res, 404, false, "Prescription did not found");
        }
        sendResponse(res, 200, true, "Prescription updated successfully");

    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}


// Delete Prescription
export const Deleteby  =  async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndDelete(req.params.id);
        if (!prescription) {
            sendResponse(res, 404, false, "Prescription did not found");
        }
        sendResponse(res, 200, true, "Prescription deleted successfully");
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}


// Search Prescription by caseNo
export const Search =  async (req, res) => {
    const caseNo = req.query.caseNo;

    if (!caseNo)  
         return sendResponse(res, 400, false, "Please provide case no");

    try {
        const prescription = await Prescription.find({ caseNo });
        if (prescription.length === 0) {
            return sendResponse(res, 404, false, "Prescription did not found for this case no");
        }
        sendResponse(res, 200, true, "Prescription fetched successfully",{data: prescription});

    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}
