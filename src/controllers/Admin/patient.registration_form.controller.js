import PatientRegistrationForm from "../../models/patient_registration_form.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const createPatientRegistrationForm = async (req, res) => {
  try {
    const {
      appointmentId,
      date,
      attendeeInfo,
      tagNo,
      patientName,
      age,
      dob,
      nid,
      identificationMark,
      species,
      breed,
      sex,
      weight,
      registrationType,
      patientType,
      caseType,
      milkYield,
      patientHistory,
      managementHistory,
      diseaseHistory,
      clinicalSigns,
      diagnosis,
      serviceRequested,
      treatmentHistory,
      patientComplaint,
      rectalPalpation,
      laboratoryFindings,
      prognosis,
    } = req.body;

    // Check for required fields
    // if (!appointmentId || !date || !ownerName || !village || !district || !upazila || !nid || !phone || !attendeeInfo || !tagNo || !patientName || !age || !dob || !identificationMark || !species || !breed || !sex || !weight || !registrationType || !patientType || !caseType) {
    //     return sendResponse(res, 400, false, "All required fields must be provided");
    // }

    const newPatientRegistrationForm = new PatientRegistrationForm({
      appointmentId,
      date,
      attendeeInfo,
      tagNo,
      patientName,
      age,
      dob,
      identificationMark,
      species,
      breed,
      sex,
      nid,
      weight,
      registrationType,
      patientType,
      caseType,
      milkYield: req.body.milkYield || "",
      patientHistory: req.body.patientHistory || "",
      managementHistory: req.body.managementHistory || "",
      diseaseHistory: req.body.diseaseHistory || "",
      clinicalSigns: req.body.clinicalSigns || "",
      diagnosis: req.body.diagnosis || "",
      serviceRequested: req.body.serviceRequested || "",
      treatmentHistory: req.body.treatmentHistory || "",
      patientComplaint: req.body.patientComplaint || "",
      rectalPalpation: req.body.rectalPalpation || "",
      laboratoryFindings: req.body.laboratoryFindings || "",
      prognosis: req.body.prognosis || "",
    });

    await newPatientRegistrationForm.save();
    return sendResponse(
      res,
      201,
      true,
      "Patient registration form created successfully",
      newPatientRegistrationForm
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getPatientRegistrationFormById = async (
  { params: { id } },
  res
) => {
  try {
    const patientRegistrationForm =
      await PatientRegistrationForm.findById(id).populate("appointmentId");
    if (!patientRegistrationForm) {
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
      "Patient registration form retrieved successfully",
      patientRegistrationForm
    );
  } catch (error) {
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
      .skip(skip)
      .limit(limit)
      .populate("appointmentId");
    const total = await PatientRegistrationForm.countDocuments();

    return sendResponse(
      res,
      200,
      true,
      "Patient registration forms retrieved successfully",
      { data: patientRegistrationForms, total }
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
