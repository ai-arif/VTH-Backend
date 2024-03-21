import Appointment from "../../models/appointment.model";
import sendResponse from "../../utils/sendResponse";
import generateRandomCaseNumber from "../../utils/generateRandomCaseNumber";

export const createAppointment = async (req, res) => {
    const { serialNumber, ownerName, address, registrationType, appointmentDate, caseType } = req.body;
    try {
        const caseNo = generateRandomCaseNumber(10);
        const appointment = new Appointment({
        ownerName,
        address,
        registrationType,
        caseType,
        });
        await appointment.save();
        return sendResponse(res, 201, true, "Appointment created successfully", appointment);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const appointments = await Appointment.find().limit(limit).skip(skip);
        return sendResponse(res, 200, true, "All appointments", appointments);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const getAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
        return sendResponse(res, 404, false, "Appointment not found");
        }
        return sendResponse(res, 200, true, "Appointment", appointment);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
        return sendResponse(res, 404, false, "Appointment not found");
        }
        appointment.status = status;
        appointment.rejectionReason = rejectionReason;
        await appointment.save();
        return sendResponse(res, 200, true, "Appointment updated successfully", appointment);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        if(req.role!=="admin") return sendResponse(res, 403, false, "Access denied");
        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
        return sendResponse(res, 404, false, "Appointment not found");
        }
        return sendResponse(res, 200, true, "Appointment deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}