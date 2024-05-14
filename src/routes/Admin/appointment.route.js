import express from "express";
const appointmentRouter = express.Router();

import {
  createAppointment,
  getAllApprovedAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentByPhone,
  updateAppointmentById,
  getAllPendingAppointments
} from "../../controllers/Admin/appointment.controller.js";



appointmentRouter.post('/',createAppointment)
appointmentRouter.get('/approved',getAllApprovedAppointments)
appointmentRouter.get('/pending',getAllPendingAppointments)
appointmentRouter.get('/phone/:phone',getAppointmentByPhone)
appointmentRouter.get('/:caseNo',getAppointment)
appointmentRouter.put('/:caseNo',updateAppointment)
appointmentRouter.delete('/:caseNo',deleteAppointment)

export default appointmentRouter