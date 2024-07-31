import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import AppointmentTest from "../../models/appointment_test.model.js";

import Appointment from "../../models/appointment.model.js";
import CategoryWiseClinicalTest from "../../models/clinicalTestByCategory.model.js";
import ClinicalTest from "../../models/clinicaltest.model.js";
import Department from "../../models/department.model.js";
import PatientRegistrationForm from "../../models/patient_registration_form.model.js";
import Prescription from "../../models/prescription.model.js";
import TestSubParameter from "../../models/sub_parameter.model.js";
import TestAdditionalField from "../../models/test_additional_field.model.js";
import TestParameter from "../../models/test_parameter.model.js";
import TestResult from "../../models/test_result.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

// updated code for test

export const deleteCategoryWiseClinicalTest = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryWiseClinicalTest.deleteOne({ _id: id });
    sendResponse(res, 200, true, "Successfully deleted test");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const addClinicalTest = async (req, res) => {
  try {
    // const { testName, testDetails } = req.body;
    const newClinicalTest = new CategoryWiseClinicalTest(req.body);
    const newTest = await newClinicalTest.save();
    console.log({ newTest });

    sendResponse(res, 200, true, "Successfully created clinical test", newTest);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getClinicalTest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const sort = -1;
  try {
    const totalTest = await CategoryWiseClinicalTest.countDocuments();
    const totalPages = Math.ceil(totalTest / limit);

    const tests = await CategoryWiseClinicalTest.find()
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    sendResponse(res, 200, true, "Successfully fetched clinical tests", {
      totalTest,
      totalPages,
      page,
      data: tests,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getClinicalTestById = async (req, res) => {
  try {
    const data = await CategoryWiseClinicalTest.findById(req.params?.id);
    sendResponse(res, 200, true, "Successfully fetched clinical test", data);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const addTest = async (req, res) => {
  try {
    // const { testName, testDetails } = req.body;
    const newClinicalTest = new ClinicalTest(req.body);
    const newTest = await newClinicalTest.save();

    if (newTest) {
      // const departmentInfo = await Department.findById(req?.body?.department);

      const title = "New test is created";
      const description = `'${req.body?.testName}' is created as new test.`;
      const department = null;
      const type = "lab";

      const destinationUrl = `/tests`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully created clinical test", newTest);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, error.message);
  }
};

export const getTest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const sort = -1;
  try {
    const totalTest = await ClinicalTest.countDocuments();
    const totalPages = Math.ceil(totalTest / limit);

    const tests = await ClinicalTest.find()
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    sendResponse(res, 200, true, "Successfully fetched clinical tests", {
      totalTest,
      totalPages,
      page,
      data: tests,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const updateTest = async (req, res) => {
  const { testName, testDetails } = req.body;
  const { id } = req.params;
  try {
    const existTest = await ClinicalTest.findOne({ _id: id });
    if (!existTest) return res.json({ message: "Did not found the test" });

    await ClinicalTest.updateOne({ _id: id }, { testName, testDetails });
    res.json({ message: "Successfully updated test" });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    const existTest = await ClinicalTest.findOne({ _id: id });
    if (!existTest) return res.json({ message: "Did not found the test" });

    const result = await ClinicalTest.deleteOne({ _id: id });

    if (result) {
      // const departmentInfo = await Department.findById(department);

      const title = `A test has been deleted`;
      const description = `Test: '${existTest?.testName}' has been removed`;
      const department = null;
      const type = "lab";
      const destinationUrl = `/tests`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully deleted clinical test");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// testName search clinical test with pagination and total count for that condition
export const searchTest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const sort = -1;
  const search = req.query.search;

  try {
    const totalTest = await CategoryWiseClinicalTest.countDocuments({
      testName: { $regex: search, $options: "i" },
    });
    const totalPages = Math.ceil(totalTest / limit);

    const tests = await CategoryWiseClinicalTest.find({
      testName: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit);

    sendResponse(res, 200, true, "Successfully fetched clinical tests", {
      totalTest,
      totalPages,
      page,
      data: tests,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// TEST PARAMETER

export const AddParameter = async (req, res) => {
  try {
    const { name, testId } = req.body;
    const newParameter = new TestParameter({ name, test: testId });
    await newParameter.save();
    sendResponse(res, 200, true, "Successfully added parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const parameters = await TestParameter.find({ test: id }).sort({
      createdAt: -1,
    });
    sendResponse(res, 200, true, "Successfully fetched parameter", {
      data: parameters,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllParameter = async (req, res) => {
  try {
    const parameters = await TestParameter.find().sort({ createdAt: -1 });
    sendResponse(res, 200, true, "Successfully fetched parameter", {
      data: parameters,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteParameter = async (req, res) => {
  try {
    const { id } = req.params;
    await TestParameter.deleteOne({ _id: id });
    sendResponse(res, 200, true, "Successfully deleted parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await TestParameter.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
        },
      }
    );
    sendResponse(res, 200, true, "Successfully updated parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

//SUB PARAMETER
export const AddSubParameter = async (req, res) => {
  try {
    const { sub_parameter_type, text, check, test_parameter } = req.body;
    // console.log(req.body);
    //update by ak
    const newSubParameter = new TestSubParameter({
      ...req.body,
    });
    // const newSubParameter = new TestSubParameter({
    //   sub_parameter_type,
    //   text,
    //   check,
    //   test_parameter,
    // });
    await newSubParameter.save();
    sendResponse(res, 200, true, "Successfully added sub parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllSubParameter = async (req, res) => {
  try {
    const sub_parameters = await TestSubParameter.find().sort({
      createdAt: -1,
    });
    sendResponse(res, 200, true, "Successfully fetched sub parameter", {
      data: sub_parameters,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getSubParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const sub_parameter = await TestSubParameter.find({ test_parameter: id });
    sendResponse(res, 200, true, "Successfully fetched sub parameter", {
      data: sub_parameter,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteSubParameter = async (req, res) => {
  try {
    const { id } = req.params;
    await TestSubParameter.deleteOne({ _id: id });
    sendResponse(res, 200, true, "Successfully deleted sub parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateSubParameter = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await TestSubParameter.updateOne(
      { _id: id },
      {
        $set: {
          title: name,
        },
      }
    );

    sendResponse(res, 200, true, "Successfully updated sub parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Additional Field
export const AddAdditionalField = async (req, res) => {
  try {
    const data = req.body;
    const newAdditionalField = new TestAdditionalField({
      ...req.body,
    });

    await newAdditionalField.save();
    sendResponse(res, 200, true, "Successfully added new additional field");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllAdditionalField = async (req, res) => {
  try {
    const test_additional_field = await TestAdditionalField.find().sort({
      createdAt: -1,
    });
    sendResponse(res, 200, true, "Successfully fetched all additional field", {
      data: test_additional_field,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getAdditionalField = async (req, res) => {
  try {
    const { id } = req.params;
    const test_additional_field = await TestAdditionalField.find({
      sub_test_parameter: id,
    });
    sendResponse(res, 200, true, "Successfully fetched additional field", {
      data: test_additional_field,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteAdditionalField = async (req, res) => {
  try {
    const { id } = req.params;
    await TestAdditionalField.deleteOne({ _id: id });
    sendResponse(res, 200, true, "Successfully deleted additional field");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateAdditionalField = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await TestAdditionalField.updateOne(
      { _id: id },
      {
        $set: {
          additionalFieldTitle: name,
        },
      }
    );

    sendResponse(res, 200, true, "Successfully updated sub parameter");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// send all test result
export const fullTestField = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the main clinical test data
    const testData = await ClinicalTest.findById(id);
    if (!testData) {
      return sendResponse(res, 404, false, "Clinical Test not found");
    }

    // Fetch associated test parameters
    const testParams = await TestParameter.find({ test: testData._id });
    const data = {
      ...testData._doc,
      testParams: await Promise.all(
        testParams.map(async (testParam) => {
          // Fetch sub parameters for each test parameter
          const subTestParams = await TestSubParameter.find({
            test_parameter: testParam._id,
          });

          // Fetch additional fields for each subTestParam
          const subTestParamsWithAdditionalFields = await Promise.all(
            subTestParams.map(async (subTestParam) => {
              const additionalFields = await TestAdditionalField.find({
                sub_test_parameter: subTestParam._id,
              });
              return { ...subTestParam._doc, additionalFields };
            })
          );

          return {
            ...testParam._doc,
            subTestParams: subTestParamsWithAdditionalFields,
          };
        })
      ),
    };

    // Send the enriched data
    sendResponse(res, 200, true, "Successfully fetched additional field", data);
  } catch (error) {
    console.error("Error fetching clinical test data:", error);
    sendResponse(res, 500, false, error.message);
  }
};

// test result
export const AddTestResult = async (req, res) => {
  try {
    const { data, id } = req.body;
    const result = await TestResult.findByIdAndUpdate(
      id,
      {
        $set: { data: { ...data, testedBy: req.id }, status: true },
      },
      { new: true }
    );

    // sending notification
    if (result) {
      const r = await TestResult.findById(result?._id)
        .populate("appointmentId")
        .populate("testId");

      const title = `Case no: ${r?.appointmentId?.caseNo}'s test result.`;
      const description = `${r?.appointmentId?.ownerName}'s "${r?.testId?.testName}" test's result has been submitted.`;
      const department = r?.appointmentId?.department;
      const type = "doctor-test-result";
      const destinationUrl = `/test-result/${r?.registrationId}`;
      // const destinationUrl = `/incomming-test/${result?.registrationId}`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully added test result");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};

// add / update test total const
export const updateTestCost = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // const result = await PatientRegistrationForm.findByIdAndUpdate(
    const result = await TestResult.findByIdAndUpdate(
      id,
      {
        $set: { amount: data?.amount, paymentStatus: true },
      },
      { new: true }
    );

    // console.log({ result })

    // sending notification
    if (result) {
      const r = await Appointment.findById(result?.appointmentId);

      // console.log({ r })

      const title = `Case no: ${r?.caseNo}'s test payment.`;
      const description = `${r?.ownerName}'s test's payment successful. Paid amount: ${data?.amount}`;
      const department = r?.department;
      const type = "test-result";

      const destinationUrl = `/incomming-test`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully updated test result");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};

// update test result
export const updateTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, status } = req.body;

    const result = await TestResult.findByIdAndUpdate(id, {
      $set: { data: data, status },
    });

    // sending notification
    if (result && status) {
      const r = await TestResult.findById(result?._id)
        .populate("appointmentId")
        .populate("testId");

      const title = `Case no: ${r?.appointmentId?.caseNo}'s test result.`;
      const description = `${r?.appointmentId?.ownerName}'s "${r?.testId?.testName}" test's result has been updated.`;
      const department = r?.appointmentId?.department;
      const type = "doctor-test-result";
      const destinationUrl = `/test-result/${r?.registrationId}`;
      // const destinationUrl = `/incomming-test/${result?.registrationId}`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Successfully updated test result");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};

// update test payment status
export const updatePatientRegistrationTestStatus = async (req, res) => {
  try {
    const result = await PatientRegistrationForm.findByIdAndUpdate(
      req.params.id,
      { $set: { testStatus: req.body.status } },
      { new: true }
    );

    if (result && req.body.status == "success") {
      const r = await Appointment.findById(result?.appointmentId);

      const title = `Case no: ${r?.caseNo}'s test result.`;
      const description = `${r?.ownerName}'s full test result has been submitted.`;
      const department = r?.appointment?.department;
      const type = "doctor-test-result";
      const destinationUrl = `/incomming-test/${req.params.id}`;
      // const destinationUrl = `/prescription/view/${r?.appointment?._id}`;

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

// delete test result
export const deleteTestResult = async (req, res) => {
  try {
    const { id } = req.params;

    await TestResult.findByIdAndUpdate(
      id,
      { $set: { isDeletedForLab: true } },
      { new: true }
    );
    sendResponse(res, 200, true, "Deleted successfully!");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};
// delete test result of a registration form
export const deleteTestResultForARegistrationForm = async (req, res) => {
  try {
    const { id } = req.params;
    await PatientRegistrationForm.findByIdAndUpdate(
      id,
      { $set: { isTestDeleteForLab: true } },
      { new: true }
    );
    sendResponse(res, 200, true, "Deleted successfully!");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, false, error.message);
  }
};

export const getAllTestResult = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const search = req.query.search
    ? req.query.search.trim().replace(/\s+/g, " ")
    : "";
  const skip = (page - 1) * limit;

  try {
    let matchStage = { isDeletedForLab: { $ne: true } };

    if (search) {
      const conditions = [
        { "appointmentDetails.ownerName": { $regex: search, $options: "i" } },
        { "appointmentDetails.phone": { $regex: search, $options: "i" } },
      ];

      // Add caseNo condition only if search can be parsed as a number
      if (!isNaN(search)) {
        conditions.push({ "appointmentDetails.caseNo": Number(search) });
      }

      matchStage = { $or: conditions, isDeletedForLab: { $ne: true } };
    }

    const result = await TestResult.aggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointmentDetails",
        },
      },
      { $unwind: "$appointmentDetails" },
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const countResult = await TestResult.aggregate([
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointmentDetails",
        },
      },
      { $unwind: "$appointmentDetails" },
      { $match: matchStage },
      { $count: "total" },
    ]);

    const count = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Successfully fetched test result", {
      data: result,
      totalPages,
      count,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log({ id })
    const result = await TestResult.find({ appointmentId: id })
      .populate({
        path: "appointmentId",
        populate: [{ path: "species" }, { path: "breed" }],
      })
      .populate("registrationId");
    sendResponse(res, 200, true, "Successfully fetched test result", {
      data: result,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// test result by id
export const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log({ id })
    const result = await TestResult.findById(id)
      .populate({
        path: "appointmentId",
        populate: [{ path: "species" }, { path: "breed" }],
      })
      .populate("testId")
      .populate("registrationId");
    sendResponse(res, 200, true, "Successfully fetched test result", {
      data: result,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

//APPOINTMENT TEST
export const AddAppointmentTest = async (req, res) => {
  try {
    const { caseNo, test } = req.body;

    const existTest = await AppointmentTest.findOne({ caseNo });

    if (existTest) {
      let result = [...existTest.test];
      result.push(test);
      await AppointmentTest.updateOne({ caseNo }, { test: result });
    } else {
      const newAppointmentTest = new AppointmentTest({ caseNo, test });
      await newAppointmentTest.save();
    }
    sendResponse(res, 200, true, "Successfully created appointment test");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
