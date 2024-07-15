import Appointment from "../../models/appointment.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import CategoryWiseClinicalTest from "../../models/clinicalTestByCategory.model.js";
import PatientRegistrationForm from "../../models/patient_registration_form.model.js";
import TestResult from "../../models/test_result.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const createPatientRegistrationForm = async (req, res) => {
  try {
    const {
      appointmentId,
      date,
      nid,
      // species,
      // complaints,
      // breed,
      age,
      weight,
      bcs,
      milkYield,
      parity,
      illnessDuration,
      drugs,
      breeding,
      feedProvided,
      vaccinations,
      appetite,
      rumination,
      salvation,
      lacrimation,
      nasalDischarge,
      dehydration,
      respRate,
      pulseRate,
      temp,
      rumenMotility,
      others,
      sex,
      pregnancyStatus,
      treatedBefore,
      confusionWords,
      demeanour,
      physicalCondition,
      totalAnimals,
      totalSickAnimals,
      totalDeadAnimals,
      totalMortality,
      totalFatality,
      heartBeat,

      dop,
      doo,
      tests,
    } = req.body;

    // Check for required fields
    // if (!appointmentId || !date || !ownerName || !village || !district || !upazila || !nid || !phone || !attendeeInfo || !tagNo || !patientName || !age || !dob || !identificationMark || !species || !breed || !sex || !weight || !registrationType || !patientType || !caseType) {
    //     return sendResponse(res, 400, false, "All required fields must be provided");
    // }

    const newPatientRegistrationForm = new PatientRegistrationForm({
      appointmentId,
      date,
      age,
      weight,
      // species,
      // complaints: req.body.complaints || "",
      // breed: req.body.breed || "",
      illnessDuration,
      drugs,
      breeding,
      feedProvided,
      vaccinations,
      appetite,
      salvation,
      lacrimation,
      nasalDischarge,
      respRate,
      pulseRate,
      temp,
      sex,
      treatedBefore,
      confusionWords,
      demeanour,
      physicalCondition,
      totalAnimals,
      totalSickAnimals,
      totalDeadAnimals,
      totalMortality,
      totalFatality,
      heartBeat,
      nid: req.body.nid || "",
      bcs: req.body.bcs || "",
      milkYield: req.body.milkYield || "",
      parity: req.body.parity || "",
      rumination: req.body.rumination || "",
      dehydration: req.body.dehydration || "",
      rumenMotility: req.body.rumenMotility || "",
      others: req.body.others || "",
      pregnancyStatus: req.body.pregnancyStatus || "",
      dop: req.body.dop || "",
      doo: req.body.doo || "",
      tests: req.body.tests || [],
      totalTestCost: req.body?.totalTestCost || 0.0,
    });

    const registeredData = await newPatientRegistrationForm.save();

    const AppointmentResult = await Appointment.findById(appointmentId)
      .populate("department")
      .select({ caseNo: 1, department: 1, phone: 1 });

    const testsResult = await CategoryWiseClinicalTest.find({
      _id: { $in: req.body?.tests },
    });

    const testString = testsResult?.map((t) => t?.testName).join(", ") || "";

    if (testString) {
      // test found
      const testResultData = testsResult?.map(async (t) => {
        const data = {
          testId: t?._id,
          registrationId: registeredData?._id,
          appointmentId,
          name: t?.testName,
          phone: AppointmentResult?.phone,
        };
        const res = await TestResult.create(data);
      });

      // Notification
      const title = `New Test Assigned`;
      const description = `'${testString}' has been assigned to a new registered patient. Case no: ${AppointmentResult?.caseNo}`;
      const department = AppointmentResult?.department;
      const type = "lab";
      const destinationUrl = `/incomming-test`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );

      const title2 = `New patient registered`;
      const description2 = `New patient registered to ${AppointmentResult?.department?.name} department`;
      const department2 = AppointmentResult?.department;
      const type2 = "admin-doctor";
      const destinationUrl2 = `/patient-registration/view`;

      const notify2 = await createNotification(
        title2,
        description2,
        department2,
        type2,
        destinationUrl2
      );
    } else {
      const title2 = `New patient registered`;
      const description2 = `New patient registered to ${AppointmentResult?.department?.name} department`;
      const department2 = AppointmentResult?.department;
      const type2 = "admin-doctor";
      const destinationUrl2 = `/patient-registration/view`;

      const notify2 = await createNotification(
        title2,
        description2,
        department2,
        type2,
        destinationUrl2
      );

    }

    return sendResponse(
      res,
      201,
      true,
      "Patient registration form created successfully",
      newPatientRegistrationForm
    );
  } catch (error) {
    console.log({ error });
    return sendResponse(res, 500, false, error.message);
  }
};

export const getPatientRegistrationFormById = async (
  { params: { id } },
  res
) => {
  try {
    // const patientRegistrationForm = await PatientRegistrationForm.findById(id).populate("appointmentId");
    const patientRegistrationForm = await PatientRegistrationForm.findById(id);

    if (!patientRegistrationForm) {
      return sendResponse(
        res,
        404,
        false,
        "Patient registration form not found"
      );
    }

    const appointmentDetails = await Appointment.findById(patientRegistrationForm?.appointmentId).populate("complaint")
      .populate("species").populate("breed");

    patientRegistrationForm.appointmentId = appointmentDetails;


    return sendResponse(
      res,
      200,
      true,
      "Patient registration form retrieved successfully",
      patientRegistrationForm
    );
  } catch (error) {
    console.log({ error })
    return sendResponse(res, 500, false, error.message);
  }
};

export const updatePatientRegistrationFormById = async (
  { params: { id }, body },
  res
) => {
  try {
    const updatedPatientRegistrationForm =
      await PatientRegistrationForm.findByIdAndUpdate(id, body, { new: true });
    if (!updatedPatientRegistrationForm) {
      return sendResponse(
        res,
        404,
        false,
        "Patient registration form not found"
      );
    }
    return sendResponse(
      res,
      200,
      true,
      "Patient registration form updated successfully",
      updatedPatientRegistrationForm
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const deletePatientRegistrationFormById = async (
  { params: { id } },
  res
) => {
  try {
    const deletedPatientRegistrationForm =
      await PatientRegistrationForm.findByIdAndDelete(id);
    if (!deletedPatientRegistrationForm) {
      return sendResponse(
        res,
        404,
        false,
        "Patient registration form not found"
      );
    }
    return sendResponse(
      res,
      200,
      true,
      "Patient registration form deleted successfully",
      deletedPatientRegistrationForm
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// get all registrations using pagination
export const getAllPatientRegistrationForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const patientRegistrationForms = await PatientRegistrationForm.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("appointmentId");

    const totalCount = await PatientRegistrationForm.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      200,
      true,
      "Patient registration forms retrieved successfully",
      { data: patientRegistrationForms, totalPages }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// i need to search by ownerName, phone, caseNo fields which are inside the appointmentId field after populate, so i need to use aggregate
export const searchPatientRegistrationForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    if (!search) {
      return sendResponse(res, 500, false, "Search query is required!");
    }

    const condition = [
      { "appointmentId.ownerName": { $regex: search, $options: "i" } },
      { "appointmentId.phone": { $regex: search, $options: "i" } },
    ];

    // Add caseNo condition only if search can be parsed as a number
    if (!isNaN(search)) {
      condition.push({ "appointmentId.caseNo": parseInt(search) });
    }

    const patientRegistrationForms = await PatientRegistrationForm.aggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointmentId",
        },
      },
      {
        $unwind: "$appointmentId",
      },
      {
        $match: {
          $or: condition,
        },
      },
    ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // calculate total document count with the above condition
    const total = await PatientRegistrationForm.aggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointment",
        },
      },
      {
        $match: {
          $or: condition,
        },
      },
    ]).count("total");

    let totalPages = total.length > 0 ? Math.ceil(total[0].total / limit) : 0;

    return sendResponse(
      res,
      200,
      true,
      "Patient registration forms retrieved successfully",
      { data: patientRegistrationForms, totalPages }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// prescription for lab test
export const GetRegistrationFormsHasTest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const patientRegistrationForms = await PatientRegistrationForm.find({
      tests: { $ne: [] },
      isTestDeleteForLab: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("appointmentId");

    const totalCount = await PatientRegistrationForm.countDocuments({
      tests: { $ne: [] },
      isTestDeleteForLab: { $ne: true },
    });
    const totalPages = Math.ceil(totalCount / limit);

    sendResponse(
      res,
      200,
      true,
      "Patient registration forms successfully retrieved",
      {
        data: patientRegistrationForms,
        totalPages: totalPages,
        page,
        totalDocuments: totalCount,
      }
    );
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};

export const GetRegistrationFormsHasTestById = async (req, res) => {
  try {
    const prescriptions = await PatientRegistrationForm.findById(req.params.id)
      .populate("appointmentId")
      .populate("tests")
      .select({ tests: 1, appointmentId: 1 });

    sendResponse(
      res,
      200,
      true,
      "Patient registration form successfully retrieved",
      {
        data: prescriptions,
      }
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
