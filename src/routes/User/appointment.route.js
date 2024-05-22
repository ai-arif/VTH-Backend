import { Router } from "express";
import { createAppointment,getAllAppointments } from "../../controllers/User/appointment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const appointmentRouter = Router();
import configureMulter from "../../utils/multerConfig.js";

const upload = configureMulter("uploads");
appointmentRouter.post("/",verifyJWT,upload.single('image'), createAppointment);
appointmentRouter.get("/",verifyJWT, getAllAppointments);

export default appointmentRouter;