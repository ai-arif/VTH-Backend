import Complaint from "../../models/complaint.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const createComplaint = async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        await complaint.save();
        sendResponse(res, 201, true, "Complaint created successfully");
    } catch (error) {
        sendResponse(res, 500, error);
    }
    };

export const getComplaints = async (req, res) => {
    try {
        const complaint = await Complaint.find().populate("species");
        sendResponse(res, 200, true, "Complaint fetched successfully", complaint);
    } catch (error) {
        sendResponse(res, 500, error);
    }
    };

export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate("species");
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
        const updatedData= req.body;
        await Complaint.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });
        sendResponse(res, 200, true, "Complaint updated successfully");
    }
    catch (error) {
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
        const complaint = await Complaint.find({ species: req.params.speciesId }).populate("species");
        sendResponse(res, 200, true, "Complaint fetched successfully", complaint);
    } catch (error) {
        sendResponse(res, 500, error);
    }
    };







