import { Router } from "express";
import { createAppointment,getAllAppointments } from "../../controllers/User/appointment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const appointmentRouter = Router();

appointmentRouter.post("/", verifyJWT,createAppointment);
appointmentRouter.get("/",verifyJWT, getAllAppointments);

export default appointmentRouter;