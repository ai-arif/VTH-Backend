import express from "express";
const testRouter = express.Router();

import {
  addTest,
  getTest,
  updateTest,
  deleteTest,
  AddParameter,
  getParameter,
  AddSubParameter,
  getSubParameter,
  deleteParameter,
  updateParameter,
  deleteSubParameter,
  updateSubParameter,
  getAllSubParameter,
  AddAppointmentTest
} from "../../controllers/Admin/clinicaltest.controller.js";


testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);

testRouter.post('/parameter',AddParameter)
testRouter.get('/parameter/:id',getParameter)
testRouter.delete('/parameter/:id',deleteParameter)
testRouter.put('/parameter/:id',updateParameter)

testRouter.post("/parameter/sub",AddSubParameter)
testRouter.get("/parameter/sub/:id",getSubParameter)
testRouter.get("/parameter/all/sub",getAllSubParameter)
testRouter.delete("/parameter/sub/:id",deleteSubParameter)
testRouter.put("/parameter/sub/:id",updateSubParameter)


testRouter.post("/appointment",AddAppointmentTest)


export default testRouter;
