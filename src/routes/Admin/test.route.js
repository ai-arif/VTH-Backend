import express from "express";
const testRouter = express.Router();

import {
  AddAdditionalField,
  AddAppointmentTest,
  AddParameter,
  AddSubParameter,
  addTest,
  deleteAdditionalField,
  deleteParameter,
  deleteSubParameter,
  deleteTest,
  fullTestField,
  getAdditionalField,
  getAllAdditionalField,
  getAllParameter,
  getAllSubParameter,
  getParameter,
  getSubParameter,
  getTest,
  searchTest,
  updateAdditionalField,
  updateParameter,
  updateSubParameter,
  updateTest
} from "../../controllers/Admin/clinicaltest.controller.js";


testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);
testRouter.get("/search", searchTest);

testRouter.post('/parameter', AddParameter)
testRouter.get('/parameter/:id', getParameter)
testRouter.get('/parameters', getAllParameter)
testRouter.delete('/parameter/:id', deleteParameter)
testRouter.put('/parameter/:id', updateParameter)

testRouter.post("/parameter/sub", AddSubParameter)
testRouter.get("/parameter/sub/:id", getSubParameter)
testRouter.get("/parameter/all/sub", getAllSubParameter)
testRouter.delete("/parameter/sub/:id", deleteSubParameter)
testRouter.put("/parameter/sub/:id", updateSubParameter)


// Additional field 
testRouter.post("/parameter/additional", AddAdditionalField)
testRouter.get("/parameter/additional/:id", getAdditionalField)
testRouter.get("/parameter/all/additional", getAllAdditionalField)
testRouter.delete("/parameter/additional/:id", deleteAdditionalField)
testRouter.put("/parameter/additional/:id", updateAdditionalField)

// full test 
testRouter.get("/full-test/:id", fullTestField)



testRouter.post("/appointment", AddAppointmentTest)


export default testRouter;
