import express from "express";
const appointmentRouter = express.Router();

import {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../controllers/Admin/appointment.controller.js";



appointmentRouter.post('/',createAppointment)
appointmentRouter.get('/',getAllAppointments)
appointmentRouter.get('/:caseNo',getAppointment)
appointmentRouter.put('/:caseNo',updateAppointment)
appointmentRouter.delete('/:caseNo',deleteAppointment)

export default appointmentRouter