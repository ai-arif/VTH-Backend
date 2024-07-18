import { v4 as uuidv4 } from "uuid";
import Appointment from "../../models/appointment.model.js";
import Department from "../../models/department.model.js";
import Complaint from "../../models/complaint.model.js";
import { uploadFileToGCS } from "../../utils/multerConfig.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "../Admin/notification.controller.js";

export const createAppointment = async (req, res) => {
  try {
    const uuid = uuidv4();
    const owner = req.id;
    const numericPart = uuid.replace(/-/g, "").replace(/\D/g, "");
    const paddedNumericPart = numericPart.padStart(7, "0");
    const caseNo = paddedNumericPart.slice(0, 7);
    let images = [];
    // check if complaint exists
    // if req.breed is null then remove breed from the request body
    if (!req.body.breed) {
      delete req.body.breed;
    }
    // if req.body.complaint is null or undefined then remove complaint from the request body
    if (!req.body.complaint) {
      delete req.body.complaint;
    }

    try {
      const existingComplaint = await Complaint.findOne({
        _id: req.body.complaint,
      });
    } catch (error) {
      if (req.body.complaint != undefined) {
        const complaint = await Complaint({
          complaint: req.body.complaint,
          species: req.body.species,
        });
        const newComplaint = await complaint.save();

        req.body.complaint = newComplaint._id;
      } else {
        delete req.body.complaint;
      }
    }

    // if (req.body.complaint_text) {
    //   const complaint = await Complaint({
    //     complaint: req.body.complaint_text,
    //     species: req.body.species,
    //   });
    //   const newComplaint = await complaint.save();

    //   req.body.complaint = newComplaint._id;
    // }

    if (!owner) {
      return sendResponse(
        res,
        400,
        false,
        "Must be logged in to create an appointment"
      );
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadFileToGCS(file.buffer, file.originalname)
      );
      images = await Promise.all(uploadPromises);
    }

    const isOldPatient = await Appointment.findOne({
      phone: req?.params?.phone,
    });

    let appointment;

    if (isOldPatient) {
      appointment = new Appointment({
        ...req.body,
        patientType: "old",
        caseNo,
        owner,
        images,
      });
    } else {
      appointment = new Appointment({
        ...req.body,
        patientType: "new",
        caseNo,
        owner,
        images,
      });
    }

    const result = await appointment.save();
    // console.log({ result })

    if (result) {
      const departmentInfo = await Department.findById(req.body.department);

      const title = "New appointment";
      const description = `${departmentInfo?.name} department has a new appointment.`;
      const department = req.body.department;
      const type = "receptionist";
      const destinationUrl = `/appointment/${result.caseNo}`;

      await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
    }

    sendResponse(
      res,
      201,
      true,
      "Appointment created successfully",
      appointment
    );
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, false, error.message);
  }
};

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

    const appointments = await Appointment.find({ owner })
      .populate("department owner")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: sort });

    const count = await Appointment.countDocuments({ owner });
    const totalPages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      appointments,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
