import { v4 as uuidv4 } from "uuid";
import Appointment from "../../models/appointment.model.js";
import sendResponse from "../../utils/sendResponse.js";



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


export const getAllApprovedAppointments = async (req, res) => {
  try {
    // send with total pages
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const appointments = await Appointment.find({ status: "approved" })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    const count = await Appointment.countDocuments({ status: "approved" });
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", { appointments, totalPages });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all pending appointments
export const getAllPendingAppointments = async (req, res) => {
  try {
    // send with total pages
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const appointments = await Appointment.find({ status: "pending" })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    const count = await Appointment.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", { appointments, totalPages });

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

export const updateAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return sendResponse(res, 404, false, "Did not found the appointment");

    await Appointment.updateOne({ _id: id }, { ...req.body });
    sendResponse(res, 200, true, "Updated successfully", appointment);
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

// get appointment list by phone
export const getAppointmentByPhone = async (req, res) => {
  const { phone } = req.params;
  try {
    const appointment = await Appointment.find({ phone });
    if (!appointment) {
      return sendResponse(res, 404, false, "Did not found the appointment");
    }
    sendResponse(res, 200, true, "Showing result", appointment);
  }
  catch (error) {
    sendResponse(res, 500, false, error.message);
  }
}


// search all "pending", "approved", "rejected" appointments 
export const searchAllAppointments = async (req, res) => {
  try {
    const { search, status } = req.query;
    if (!search || !status) {
      return res.status(500).json({ success: false, message: "Status and search query needed!" });
    }


    // send with total pages
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;


    const conditions = [
      { ownerName: { $regex: search.trim().replace(/\s+/g, ' '), $options: "i" } },
      { phone: { $regex: search.trim().replace(/\s+/g, ' '), $options: "i" } },
    ];

    // Add caseNo condition only if search can be parsed as a number
    if (!isNaN(search)) {
      conditions.push({ caseNo: search });
    }


    const query = {
      status: status,
      $or: conditions
    };


    const appointments = await Appointment.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort }).select({ phone: 1, caseNo: 1, ownerName: 1, date: 1 });

    const count = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", { appointments, totalPages });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
