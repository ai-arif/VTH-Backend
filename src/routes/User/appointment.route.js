import { Router } from "express";
import { createAppointment,getAllAppointments } from "../../controllers/User/appointment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const appointmentRouter = Router();
import multerConfig from require('../../utils/multerConfig.js');

const upload = multerConfig.single('image');
appointmentRouter.post("/",verifyJWT,upload, createAppointment);
appointmentRouter.get("/",verifyJWT, getAllAppointments);

export default appointmentRouter;