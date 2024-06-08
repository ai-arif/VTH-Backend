import { Router } from "express";
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  getComplaintsBySpecies,
  updateComplaint,
} from "../../controllers/Admin/complaint.controller.js";

const complaintRouter = Router();

complaintRouter.post("/", createComplaint);
complaintRouter.get("/", getComplaints);
complaintRouter.get("/:id", getComplaintById);
complaintRouter.put("/:id", updateComplaint);

complaintRouter.delete("/:id", deleteComplaint);
complaintRouter.get("/species/:speciesId", getComplaintsBySpecies);

export default complaintRouter;
