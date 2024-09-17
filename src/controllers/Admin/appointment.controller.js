import { v4 as uuidv4 } from "uuid";
import Appointment from "../../models/appointment.model.js";
import Department from "../../models/department.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const createAppointment = async (req, res) => {
  try {
    const uuid = uuidv4();
    const numericPart = uuid.replace(/-/g, "").replace(/\D/g, "");
    const paddedNumericPart = numericPart.padStart(7, "0");
    const caseNo = paddedNumericPart.slice(0, 7);
    if (!req.body.breed) {
      delete req.body.breed;
    }
    // if req.body.complaint is null or undefined then remove complaint from the request body
    if (!req.body.complaint) {
      delete req.body.complaint;
    }
    const appointment = new Appointment({ ...req.body, caseNo });
    const result = await appointment.save();

    if (result) {
      const departmentInfo = await Department.findById(req?.body?.department);

      const title = "New appointment";
      const description = `${departmentInfo?.name} department has new appointment.`;
      const department = req?.body?.department;
      const type = "receptionist";
      const destinationUrl = `/appointment/${result?.caseNo}`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    res.json({
      success: true,
      message: "Successfully created appointment",
    });
  } catch (error) {
    console.log({ error });
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
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const count = await Appointment.countDocuments({ status: "approved" });
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      appointments,
      totalPages,
    });
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
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const count = await Appointment.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      appointments,
      totalPages,
    });
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
    // if breed is not present or empty, then remove it from the request body
    if (!req.body.breed) {
      delete req.body.breed;
    }
    if (!req.body.complaint) {
      delete req.body.complaint;
    }
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
    const appointment = await Appointment.find({
      $or: [
        { phone: phone },
        { caseNo: phone },
        { ownerName: { $regex: phone, $options: "i" } },
      ],
    })
      .populate("complaint")
      .populate("species")
      .populate("breed")
      .sort({ createdAt: -1 });

    if (!appointment || appointment.length === 0) {
      return sendResponse(res, 404, false, "No appointments found");
    }

    sendResponse(res, 200, true, "Showing result", appointment);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// search all "pending", "approved", "rejected" appointments
export const searchAllAppointments = async (req, res) => {
  try {
    const { search, status } = req.query;
    if (!search || !status) {
      return res
        .status(500)
        .json({ success: false, message: "Status and search query needed!" });
    }

    // send with total pages
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;

    const conditions = [
      {
        ownerName: {
          $regex: search.trim().replace(/\s+/g, " "),
          $options: "i",
        },
      },
      { phone: { $regex: search.trim().replace(/\s+/g, " "), $options: "i" } },
    ];

    // Add caseNo condition only if search can be parsed as a number
    if (!isNaN(search)) {
      conditions.push({ caseNo: search });
    }

    const query = {
      status: status,
      $or: conditions,
    };

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select({ phone: 1, caseNo: 1, ownerName: 1, date: 1 });

    const count = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      appointments,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update appointments payment status
export const updateAppointmentsPaymentStatusById = async (req, res) => {
  const { id } = req.params;
  const data = req?.body;
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return sendResponse(res, 404, false, "Did not found the appointment");

    await Appointment.updateOne(
      { _id: id },
      {
        $set: {
          payment: data?.payment,
          amount: data?.amount,
        },
      }
    );
    sendResponse(res, 200, true, "Updated successfully", appointment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
