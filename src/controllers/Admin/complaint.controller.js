import Complaint from "../../models/complaint.model.js";
import Species from "../../models/species.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    const result = await complaint.save();

    if (result) {
      // const departmentInfo = await Department.findById(department);
      const speciesInfo = await Species.findById(req.body?.species);

      const title = `Received a complaint`;
      const description = `Receive a new complaint about '${speciesInfo?.name}'.`;
      const department = null;
      const type = "admin";
      const destinationUrl = `/species-complaints/complaints`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }
    sendResponse(res, 201, true, "Complaint created successfully");
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, error);
  }
};

export const getComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const sort = -1;

    const complaint = await Complaint.find()
      .populate("species")
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const totalCount = await Complaint.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    sendResponse(res, 200, true, "Complaint fetched successfully", {
      data: complaint,
      totalPages,
      page,
    });
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "species"
    );
    if (!complaint) {
      return sendResponse(res, 404, false, "Complaint not found");
    }
    sendResponse(res, 200, true, "Complaint fetched successfully", complaint);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return sendResponse(res, 404, false, "Complaint not found");
    }
    const updatedData = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    sendResponse(res, 200, true, "Complaint updated successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return sendResponse(res, 404, false, "Complaint not found");
    }
    await Complaint.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Complaint deleted successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const getComplaintsBySpecies = async (req, res) => {
  try {
    const complaint = await Complaint.find({
      species: req.params.speciesId,
    }).populate("species");
    sendResponse(res, 200, true, "Complaint fetched successfully", complaint);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};
