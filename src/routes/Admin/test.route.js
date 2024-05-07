import express from "express";
const testRouter = express.Router();

import {
  addTest,
  getTest,
  updateTest,
  deleteTest,
  AddParameter
} from "../../controllers/Admin/clinicaltest.controller.js";


testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);

testRouter.post('/parameter',AddParameter)

export default testRouter;
