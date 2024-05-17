import { Router } from "express";
import { getAllPrescriptions } from "../../controllers/User/prescription.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const userPrescriptionRouter = Router();

userPrescriptionRouter.get("/",verifyJWT, getAllPrescriptions);

export default userPrescriptionRouter;