import Appointment from "../../models/appointment.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import Department from "../../models/department.model.js";
import Prescription from "../../models/prescription.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";


//Create Prescription
export const Create = async (req, res) => {
    try {
        const prescription = new Prescription(req.body);
        await prescription.save();

        // notification 
        const appointment = await Appointment.findById(req.body?.appointment).populate("department").select("department");
        const tests = await ClinicalTest.find({ _id: { $in: req.body?.tests } });

        const testString = tests?.map(t => t?.testName).join(', ') || '';

        if (testString) {
            const title = `New Test Assigned`;
            const description = `'${testString}' has been assigned by ${appointment?.department?.name} department`;
            const department = appointment?.department?._id;
            const type = "lab";

            const notify = await createNotification(title, description, department, type);
        }
        else {
            const title = `New Prescription created`;
            const description = `New prescription created by ${appointment?.department?.name} department`;
            const department = appointment?.department?._id;
            const type = "lab-pharmacy";

            const notify = await createNotification(title, description, department, type);
            // console.log({ notify })
        }

        sendResponse(res, 200, true, "Prescription successfully");
    } catch (error) {
        console.log({ error })
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
export const FindBy = async (req, res) => {
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
        sendResponse(res, 200, true, "Prescription fetched successfully", { data: prescription });

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
export const Deleteby = async (req, res) => {
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
export const Search = async (req, res) => {
    const caseNo = req.query.caseNo;

    if (!caseNo)
        return sendResponse(res, 400, false, "Please provide case no");

    try {
        const prescription = await Prescription.find({ caseNo });
        if (prescription.length === 0) {
            return sendResponse(res, 404, false, "Prescription did not found for this case no");
        }
        sendResponse(res, 200, true, "Prescription fetched successfully", { data: prescription });

    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

// prescription has a field appointment which is a reference to the Appointment model., use aggregae to search for search query parameter, and match it basis of ownerName, phone, and caseNo,
// then populate the appointment field with the department field.
// handle proper pagination and also return total number of document based on the condition
export const SearchBy = async (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!search) return sendResponse(res, 400, false, "Please provide search query parameter");

    const condition = [
        { "appointment.ownerName": { $regex: search, $options: 'i' } },
        { "appointment.phone": { $regex: search, $options: 'i' } },

    ];

    // Add caseNo condition only if search can be parsed as a number
    if (!isNaN(search)) {
        condition.push({ "appointment.caseNo": parseInt(search) });
    }

    try {
        const totalCountPipeline = [
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment",
                    foreignField: "_id",
                    as: "appointment"
                }
            },
            {
                $unwind: "$appointment"
            },
            {
                $match: {
                    $or: condition
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "appointment.department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 }
                }
            }
        ];

        const totalCountResult = await Prescription.aggregate(totalCountPipeline);

        const prescriptions = await Prescription.aggregate([
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment",
                    foreignField: "_id",
                    as: "appointment"
                }
            },
            {
                $unwind: "$appointment"
            },
            {
                $match: {
                    $or: condition
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "appointment.department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        const totalPages = Math.ceil(totalCountResult?.[0]?.totalCount / limit);

        sendResponse(res, 200, true, "Prescription fetched successfully", { data: prescriptions, totalPages: totalPages, totalDocuments: totalCountResult?.[0]?.totalCount });

    } catch (error) {
        console.log({ error })
        sendResponse(res, 500, false, error.message);
    }
}

// prescription for lab test 

export const GetPrescriptionWhichHasTest = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ tests: { $ne: [] } }).populate('appointment')
            .populate('tests').sort({ createdAt: -1 }).select({ appointment: 1, tests: 1, therapeutics: 1, testStatue: 1 });

        sendResponse(res, 200, true, "Prescriptions successfully retrieved", { data: prescriptions });
    } catch (error) {
        console.log({ error })
        sendResponse(res, 500, false, error.message);
    }
}

export const GetPrescriptionWhichHasTestById = async (req, res) => {
    try {
        const prescriptions = await Prescription.findById(req.params.id).populate('appointment')
            .populate('tests').select({ tests: 1, appointment: 1 });

        sendResponse(res, 200, true, "Prescriptions successfully retrieved", { data: prescriptions });
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}

export const updatePrescriptionTestStatus = async (req, res) => {
    try {
        const result = await Prescription.findByIdAndUpdate(req.params.id, { $set: { testStatue: req.body.status } }, { new: true });

        sendResponse(res, 200, true, "Lab test status updated successfully", { data: result });
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
}
