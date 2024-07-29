import Prescription from "../../models/prescription.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { User } from "../../models/user.model.js";
// get all prescriptions with pagination and populate appointment and department, with decending order
export const getAllPrescriptions = async (req, res) => {
  try {
    const owner = req.id;
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const user = await User.findById(owner);
    let prescriptions = await Prescription.aggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointment",
          foreignField: "_id",
          as: "appointment",
        },
      },
      {
        $unwind: "$appointment",
      },
      {
        $match: { "appointment.phone": user.phone },
      },
      {
        $lookup: {
          from: "patientregistrationforms",
          localField: "appointment._id",
          foreignField: "appointmentId",
          as: "patient",
        },
      },
      {
        $unwind: "$patient",
      },
      {
        $lookup: {
          from: "departments",
          localField: "appointment.department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $unwind: "$department",
      },
      {
        $lookup: {
          from: "species",
          localField: "appointment.species",
          foreignField: "_id",
          as: "appointment.species",
        },
      },
      {
        $unwind: "$appointment.species",
      },
      {
        $lookup: {
          from: "breeds",
          localField: "appointment.breed",
          foreignField: "_id",
          as: "appointment.breed",
        },
      },
      {
        $unwind: "$appointment.breed",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          isDeletedForPharmacy: 1,
          takesMedicinesBefore: 1,
          date: 1,
          appointment: {
            _id: 1,
            date: 1,
            time: 1,
            caseNo: 1,
            district: 1,
            upazila: 1,
            address: 1,
            numberOfAnimals: 1,
            registrationType: 1,
            patientType: 1,
            caseType: 1,
            ownerName: 1,
            phone: 1,
            status: 1,
            payment: 1,
            amount: 1,
            department: "$department",
            images: 1,
            tests: 1,
            species: 1,
            breed: 1,
            complaint: 1,
            notes: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          medicines: 1,
          diagnosis: 1,
          therapeutics: 1,
          prognosis: 1,
          advice: 1,
          nextVisit: 1,
          testStatue: 1,
          totalTestCost: 1,
          preAnestheticUsed: 1,
          sutureMaterialsUsed: 1,
          typeOfSurgery: 1,
          postOperativeCare: 1,
          briefSurgical: 1,
          createdAt: 1,
          updatedAt: 1,
          patient: 1,
        },
      },
    ]);

    prescriptions = prescriptions.filter(
      (prescription) => prescription.appointment !== null
    );

    const count = await Prescription.countDocuments();
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      prescriptions,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
