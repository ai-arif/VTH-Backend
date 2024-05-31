import express from "express";
const appointmentRouter = express.Router();

import {
  createAppointment,
  deleteAppointment,
  getAllApprovedAppointments,
  getAllPendingAppointments,
  getAppointment,
  getAppointmentByPhone,
  searchAllAppointments,
  updateAppointment,
  updateAppointmentById,
  updateAppointmentsPaymentStatusById
} from "../../controllers/Admin/appointment.controller.js";



appointmentRouter.post('/', createAppointment)
appointmentRouter.get('/approved', getAllApprovedAppointments)
appointmentRouter.get('/pending', getAllPendingAppointments)
appointmentRouter.get('/phone/:phone', getAppointmentByPhone)
appointmentRouter.get('/:caseNo', getAppointment)
appointmentRouter.put('/:caseNo', updateAppointment)
appointmentRouter.delete('/:caseNo', deleteAppointment)
appointmentRouter.patch('/:id', updateAppointmentsPaymentStatusById)

// search all appointments 
appointmentRouter.get('/', searchAllAppointments)

export default appointmentRouter