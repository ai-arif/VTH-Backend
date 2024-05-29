import { v4 as uuidv4 } from "uuid";
import Appointment from "../../models/appointment.model.js";
import Department from "../../models/department.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "../Admin/notification.controller.js";


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
    const result = await appointment.save();

    if (result) {
      const departmentInfo = await Department.findById(req?.body?.department);

      const title = "New appointment";
      const description = `${departmentInfo?.name} department has new appointment.`;
      const department = req?.body?.department;
      const type = "receptionist";

      const notify = await createNotification(title, description, department, type);
      // console.log({ notify })
    }

    sendResponse(res, 201, true, "Appointment created successfully", appointment);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
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
