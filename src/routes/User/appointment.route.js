import { Router } from "express";
import { createAppointment, getAllAppointments } from "../../controllers/User/appointment.controller.js";
import { appointmentSSLPayment, appointmentSSLPaymentFail, appointmentSSLPaymentSuccess } from "../../controllers/User/payment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { configureMulter } from "../../utils/multerConfig.js";
const appointmentRouter = Router();
const upload = configureMulter("uploads");

appointmentRouter.post("/", verifyJWT, upload.array('images', 5), createAppointment);
appointmentRouter.get("/", verifyJWT, getAllAppointments);

// payment apis 
appointmentRouter.post('/payment/success/:id', appointmentSSLPaymentSuccess)
appointmentRouter.post('/payment/fail/:id', appointmentSSLPaymentFail)
appointmentRouter.post('/payment/:id', appointmentSSLPayment);


export default appointmentRouter;