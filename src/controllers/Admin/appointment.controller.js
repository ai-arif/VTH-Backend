import Appointment from "../../models/appointment.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { v4 as uuidv4 } from "uuid";



export const createAppointment = async (req, res) => {
  try {
    const uuid = uuidv4();
    const numericPart = uuid.replace(/-/g, "").replace(/\D/g, "");
    const paddedNumericPart = numericPart.padStart(7, "0");
    const caseNo = paddedNumericPart.slice(0, 7);

    const appointment = new Appointment({ ...req.body, caseNo });
    await appointment.save();

    res.json({
      success: true,
      message: "Successfully created appointment",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllAppointments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const appointments = await Appointment.find()
      .populate('department','name')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    res.json({ success: true, message: "Showing results", data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAppointment = async (req, res) => {
  const { caseNo } = req.params;
  try {
    const appointment = await Appointment.findOne({ caseNo });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Did not found the appointment" });
    }
    res.json({ success: true, message: "Showing result", data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateAppointment = async (req, res) => {
  const { caseNo } = req.params;
  try {
    const appointment = await Appointment.findOne({ caseNo });
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Did not found the appointment" });

    await Appointment.updateOne({ caseNo }, { ...req.body });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteAppointment = async (req, res) => {
  const { caseNo } = req.params;
  try {
    const appointment = await Appointment.findOne({ caseNo });
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Did not found the appointment" });

    await Appointment.deleteOne({ caseNo });
    res.json({ success: true, message: "Deleted successfully successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
