import { Router } from "express";
import { createAppointment,getAllAppointments } from "../../controllers/User/appointment.controller.js";

const appointmentRouter = Router();

appointmentRouter.post("/", createAppointment);

export default appointmentRouter;