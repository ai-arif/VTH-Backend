import { Router } from "express";
import { getAllPrescriptions } from "../../controllers/User/prescription.controller.js";

const userPrescriptionRouter = Router();

userPrescriptionRouter.get("/", getAllPrescriptions);

export default userPrescriptionRouter;