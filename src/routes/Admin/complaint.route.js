import { Router } from "express";
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  getComplaintsBySpecies,
  searchComplaints,
  updateComplaint,
} from "../../controllers/Admin/complaint.controller.js";

const complaintRouter = Router();

// search
complaintRouter.get("/search", searchComplaints);

complaintRouter.post("/", createComplaint);
complaintRouter.get("/", getComplaints);
complaintRouter.get("/:id", getComplaintById);
complaintRouter.put("/:id", updateComplaint);

complaintRouter.delete("/:id", deleteComplaint);
complaintRouter.get("/species/:speciesId", getComplaintsBySpecies);

export default complaintRouter;
