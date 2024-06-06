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
    const prescriptionData = await prescription.save();
    const appointmentData = await Prescription.findById(
      prescriptionData?._id
    ).populate("appointment");

    // notification
    const appointment = await Appointment.findById(req.body?.appointment)
      .populate("department")
      .select("department");
    const tests = await ClinicalTest.find({ _id: { $in: req.body?.tests } });

    const testString = tests?.map((t) => t?.testName).join(", ") || "";

    if (testString) {
      const title = `New Test Assigned`;
      const description = `'${testString}' has been assigned by ${appointment?.department?.name} department`;
      const department = appointment?.department?._id;
      const type = "lab";
      const destinationUrl = `/incomming-test`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );

      const title2 = `New Prescription created`;
      const description2 = `New prescription created by ${appointment?.department?.name} department`;
      const department2 = appointment?.department?._id;
      const type2 = "pharmacy";
      const destinationUrl2 = `/prescription/view`;

      const notify2 = await createNotification(
        title2,
        description2,
        department2,
        type2,
        destinationUrl2
      );
    } else {
      const title = `New Prescription created`;
      const description = `New prescription created by ${appointment?.department?.name} department`;
      const department = appointment?.department?._id;
      const type = "lab-pharmacy";
      const destinationUrl = `/prescription/view`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Prescription successfully", {
      data: appointmentData,
    });
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};

// Read All Prescriptions
export const Find = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const prescriptions = await Prescription.find()
      .populate({
        path: "appointment",
        populate: {
          path: "department",
          model: "Department",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Prescription.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    sendResponse(res, 200, true, "Prescriptions successfully retrieved", {
      data: prescriptions,
      totalPages,
      totalDocuments: totalCount,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Read Prescription by ID
export const FindBy = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate({
      path: "appointment",
      populate: {
        path: "department",
        model: "Department",
      },
    });
    if (!prescription) {
      sendResponse(res, 404, false, "Prescription did not found");
    }
    sendResponse(res, 200, true, "Prescription fetched successfully", {
      data: prescription,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Update Prescription
export const Updateby = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prescription) {
      sendResponse(res, 404, false, "Prescription did not found");
    }
    sendResponse(res, 200, true, "Prescription updated successfully");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

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
};

// Search Prescription by caseNo
export const Search = async (req, res) => {
  const caseNo = req.query.caseNo;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!caseNo) return sendResponse(res, 400, false, "Please provide case no");

  try {
    const prescription = await Prescription.find({ caseNo })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const count = await Prescription.countDocuments({ caseNo });
    const totalPages = count / limit;

    if (prescription.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "Prescription did not found for this case no"
      );
    }
    sendResponse(res, 200, true, "Prescription fetched successfully", {
      data: prescription,
      totalPages: totalPages,
      totalDocuments: count,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// prescription has a field appointment which is a reference to the Appointment model., use aggregae to search for search query parameter, and match it basis of ownerName, phone, and caseNo,
// then populate the appointment field with the department field.
// handle proper pagination and also return total number of document based on the condition
export const SearchBy = async (req, res) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!search)
    return sendResponse(
      res,
      400,
      false,
      "Please provide search query parameter"
    );

  const condition = [
    { "appointment.ownerName": { $regex: search, $options: "i" } },
    { "appointment.phone": { $regex: search, $options: "i" } },
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
          as: "appointment",
        },
      },
      {
        $unwind: "$appointment",
      },
      {
        $match: {
          $or: condition,
        },
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
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
        },
      },
    ];

    const totalCountResult = await Prescription.aggregate(totalCountPipeline);

    const prescriptions = await Prescription.aggregate([
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
        $match: {
          $or: condition,
        },
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
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalPages = Math.ceil(totalCountResult?.[0]?.totalCount / limit);

    sendResponse(res, 200, true, "Prescription fetched successfully", {
      data: prescriptions,
      totalPages: totalPages,
      totalDocuments: totalCountResult?.[0]?.totalCount,
    });
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};

// prescription for lab test

export const GetPrescriptionWhichHasTest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const prescriptions = await Prescription.find({ tests: { $ne: [] } })
      .populate("appointment")
      .populate("tests")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select({
        appointment: 1,
        tests: 1,
        therapeutics: 1,
        testStatue: 1,
        totalTestCost: 1,
      });

    const totalCount = await Prescription.countDocuments({
      tests: { $ne: [] },
    });
    const totalPages = totalCount / limit;

    sendResponse(res, 200, true, "Prescriptions successfully retrieved", {
      data: prescriptions,
      totalPages: totalPages,
      totalDocuments: totalCount,
    });
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};

export const GetPrescriptionWhichHasTestById = async (req, res) => {
  try {
    const prescriptions = await Prescription.findById(req.params.id)
      .populate("appointment")
      .populate("tests")
      .select({ tests: 1, appointment: 1 });

    sendResponse(res, 200, true, "Prescriptions successfully retrieved", {
      data: prescriptions,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updatePrescriptionTestStatus = async (req, res) => {
  try {
    const result = await Prescription.findByIdAndUpdate(
      req.params.id,
      { $set: { testStatue: req.body.status } },
      { new: true }
    );

    if (result && req.body.status == "success") {
      const r = await Prescription.findById(req.params.id).populate(
        "appointment"
      );

      const title = `Case no: ${r?.appointment?.caseNo}'s test result.`;
      const description = `${r?.appointment?.ownerName}'s full test result has been submitted.`;
      const department = r?.appointment?.department;
      const type = "doctor-test-result";
      // const destinationUrl = `/test-result/${result?.prescriptionId}`
      const destinationUrl = `/prescription/view/${r?.appointment?._id}`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Lab test status updated successfully", {
      data: result,
    });
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};
