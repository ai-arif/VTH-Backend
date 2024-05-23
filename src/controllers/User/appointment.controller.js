import Appointment from "../../models/appointment.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { v4 as uuidv4 } from "uuid";


export const createAppointment = async (req, res) => {
  try {
    const uuid = uuidv4();
    const owner = req.id;
    const numericPart = uuid.replace(/-/g, "").replace(/\D/g, "");
    const paddedNumericPart = numericPart.padStart(7, "0");
    const caseNo = paddedNumericPart.slice(0, 7);
    let image = '';

    if (req.file) {
      image = req.file.path;
    }
    if (!owner) {
      return sendResponse(res, 400, false, "Must be logged in to create an appointment");
    }
    
    const appointment = new Appointment({
      ...req.body,
      caseNo,
      owner,
      image,
    });
    await appointment.save();

    res.json({
      success: true,
      message: "Successfully created appointment",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// get all appointments with pagination
export const getAllAppointments = async (req, res) => {
  try {
    const owner = req.id;
    if (!owner) {
      return sendResponse(res, 400, false, "Owner is required");
    }
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;


    const appointments = await Appointment.find({ owner }).populate('department owner')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    const count = await Appointment.countDocuments();
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", { appointments, totalPages });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
