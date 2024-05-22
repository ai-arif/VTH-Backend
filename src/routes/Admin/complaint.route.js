import { Router } from "express";
import { getComplaintsBySpecies,createComplaint,deleteComplaint,getComplaintById,getComplaints,updateComplaint } from "../../controllers/Admin/complaint.controller";

const complaintRouter = Router();

complaintRouter.post('/',createComplaint)
complaintRouter.get('/',getComplaints)
complaintRouter.get('/:id',getComplaintById)
complaintRouter.put('/:id',updateComplaint)

complaintRouter.delete('/:id',deleteComplaint)
complaintRouter.get('/species/:speciesId',getComplaintsBySpecies)