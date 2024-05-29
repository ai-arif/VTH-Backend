import Admin from "../../models/admin.model.js";
import Appointment from "../../models/appointment.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import Complaint from "../../models/complaint.model.js";
import Department from "../../models/department.model.js";
import Medicine from "../../models/medicine.model.js";
import PatientRegistrationForm from "../../models/patient_registration_form.model.js";
import Pharmacy from "../../models/pharmacy.model.js";
import Prescription from "../../models/prescription.model.js";
import Species from "../../models/species.model.js";
import TestResult from "../../models/test_result.model.js";
// import Species from "../../models/species.model.js";
import { User } from "../../models/user.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const getOverview = async (req, res) => {
    const daysBefore = req.query?.daysBefore || 30;

    const today = new Date();
    const xDaysAgo = new Date(today);
    xDaysAgo.setDate(today.getDate() - parseInt(daysBefore));

    // Ensure time components are set correctly
    today.setHours(23, 59, 59, 999); // End of today
    xDaysAgo.setHours(0, 0, 0, 0); // Start of 5 days ago


    try {
        const staffsOverview = await Admin.aggregate([
            {
                $match: {
                    createdAt: { $gte: xDaysAgo, $lte: today }
                }
            },
            {
                $group: { _id: "$role", total: { $sum: 1 } }
            },
            {
                $group: {
                    _id: null,
                    totalRoles: { $sum: 1 },
                    staffs: { $push: { dept: "$_id", members: "$total" } },
                    totalStuffs: { $sum: "$total" }
                }
            }
        ]);

        const { totalRoles, staffs, totalStuffs } = staffsOverview?.[0] || [];

        const users = await User.countDocuments();
        const departments = await Department.countDocuments();
        const clinicalTests = await ClinicalTest.countDocuments();
        const species = await Species.countDocuments();

        const complaintsOverview = await Complaint.aggregate([
            {
                $match: {
                    createdAt: { $gte: xDaysAgo, $lte: today }
                }
            },
            {
                $lookup: {
                    from: 'species',
                    localField: 'species',
                    foreignField: '_id',
                    as: 'species'
                }
            },
            {
                $unwind: "$species"
            },
            {
                $group: {
                    _id: "$species.name",
                    complaintCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    speciesComplaints: { $push: { species: "$_id", count: "$complaintCount" } },
                    totalComplaints: { $sum: "$complaintCount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    speciesComplaints: 1,
                    totalComplaints: 1
                }
            }
        ]);

        const { speciesComplaints, totalComplaints } = complaintsOverview?.[0] || {};

        const medicines = await Medicine.countDocuments();
        const prescriptions = await Prescription.countDocuments({ createdAt: { $gte: xDaysAgo, $lte: today } });
        const pharmacyOrders = await Pharmacy.countDocuments({ createdAt: { $gte: xDaysAgo, $lte: today } });

        const AppointmentOverview = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: xDaysAgo, $lte: today }
                }
            },
            {
                $project: { department: 1 }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            { $unwind: "$department" },
            {
                $group: {
                    _id: "$department.name",
                    count: { $sum: 1 }
                }

            },
            {
                $group: {
                    _id: null,
                    allAppointments: { $push: { department: "$_id", count: "$count" } },
                    totalAppointment: { $sum: "$count" }
                }
            },

        ]);

        const { allAppointments, totalAppointment } = AppointmentOverview?.[0] || {};

        const testResults = await TestResult.countDocuments({ createdAt: { $gte: xDaysAgo, $lte: today } });
        const totalPatientRegister = await PatientRegistrationForm.countDocuments({ createdAt: { $gte: xDaysAgo, $lte: today } });




        // result |=========================>
        // const result = { testResults };
        const result = {
            totalRoles, staffs, totalStuffs, users, departments, clinicalTests,
            species, speciesComplaints, totalComplaints, medicines, allAppointments, totalAppointment,
            prescriptions, pharmacyOrders, testResults, totalPatientRegister
        };

        return sendResponse(
            res,
            200,
            true,
            "Overview retrieved successfully",
            result
        );
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}
