import express from "express";
const testRouter = express.Router();

import {
  addTest,
  getTest,
  updateTest,
  deleteTest,
} from "../../controllers/Admin/clinicaltest.controller.js";

testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);

export default testRouter;
