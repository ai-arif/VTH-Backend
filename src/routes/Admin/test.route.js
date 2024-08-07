import express from "express";
const testRouter = express.Router();
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
import {
  AddAdditionalField,
  AddAppointmentTest,
  AddParameter,
  AddSubParameter,
  AddTestResult,
  addClinicalTest,
  addTest,
  deleteAdditionalField,
  deleteCategoryWiseClinicalTest,
  deleteParameter,
  deleteSubParameter,
  deleteTest,
  deleteTestResult,
  deleteTestResultForARegistrationForm,
  fullTestField,
  getAdditionalField,
  getAllAdditionalField,
  getAllParameter,
  getAllSubParameter,
  getAllTestResult,
  getClinicalTest,
  getClinicalTestById,
  getParameter,
  getSubParameter,
  getTest,
  getTestResult,
  getTestResultById,
  searchTest,
  updateAdditionalField,
  updateParameter,
  updatePatientRegistrationTestStatus,
  updateSubParameter,
  updateTest,
  updateTestCost,
  updateTestResult,
} from "../../controllers/Admin/clinicaltest.controller.js";

// updated test
// to do
testRouter.post("/add", addClinicalTest);
testRouter.get("/get", getClinicalTest);
testRouter.get("/get/:id", getClinicalTestById);
testRouter.delete("/test/:id", deleteCategoryWiseClinicalTest);
testRouter.delete("/incoming-test/:id", deleteTestResultForARegistrationForm);
testRouter.patch("/status/:id", updatePatientRegistrationTestStatus);

// test
testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);
testRouter.get("/search", searchTest);

// params
testRouter.post("/parameter", AddParameter);
testRouter.get("/parameter/:id", getParameter);
testRouter.get("/parameters", getAllParameter);
testRouter.delete("/parameter/:id", deleteParameter);
testRouter.put("/parameter/:id", updateParameter);

//sub params
testRouter.post("/parameter/sub", AddSubParameter);
testRouter.get("/parameter/sub/:id", getSubParameter);
testRouter.get("/parameter/all/sub", getAllSubParameter);
testRouter.delete("/parameter/sub/:id", deleteSubParameter);
testRouter.put("/parameter/sub/:id", updateSubParameter);

// Additional field
testRouter.post("/parameter/additional", AddAdditionalField);
testRouter.get("/parameter/additional/:id", getAdditionalField);
testRouter.get("/parameter/all/additional", getAllAdditionalField);
testRouter.delete("/parameter/additional/:id", deleteAdditionalField);
testRouter.put("/parameter/additional/:id", updateAdditionalField);

// single test
testRouter.get("/single-test/:id", getTestResultById);
// full test
testRouter.get("/full-test/:id", fullTestField);
testRouter.post("/test-result", verifyAdminToken, AddTestResult);
testRouter.get("/test-result", getAllTestResult);
testRouter.get("/test-result/:id", getTestResult);
testRouter.put("/test-result/:id", verifyAdminToken, updateTestResult);
testRouter.delete("/test-result/:id", verifyAdminToken, deleteTestResult);
//add or update test cost
testRouter.patch("/test-result/:id", verifyAdminToken, updateTestCost);

testRouter.post("/appointment", AddAppointmentTest);

export default testRouter;
