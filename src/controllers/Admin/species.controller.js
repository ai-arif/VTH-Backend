import Species from "../../models/Species.model.js";
import sendResponse from "../../utils/sendResponse.js";

export const createSpecies = async (req, res) => {
    try {
        const species = new Species(req.body);
        await species.save();
        sendResponse(res, 201, true, "Species created successfully");
    } catch (error) {
        sendResponse(res, 500, error);
    }
};

export const getSpecies = async (req, res) => {
    try {
        const species = await Species.find();
        sendResponse(res, 200, true, "Species fetched successfully", species);
    } catch (error) {
        sendResponse(res, 500, error);
    }
};

export const getSpeciesById = async (req, res) => {
    try {
        const species = await Species.findById(req.params.id);
        if (!species) {
            return sendResponse(res, 404, false, "Species not found");
        }
        sendResponse(res, 200, true, "Species fetched successfully", species);
    } catch (error) {
        sendResponse(res, 500, error);
    }
};

export const updateSpecies = async (req, res) => {
    try {
        const species = await Species.findById(req.params.id);
        if (!species) {
            return sendResponse(res, 404, false, "Species not found");
        }
        const updatedData = req.body;
        await Species.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });
        sendResponse(res, 200, true, "Species updated successfully");
    }
    catch (error) {
        sendResponse(res, 500, error);
    }
};

export const deleteSpecies = async (req, res) => {
    try {
        const species = await Species.findById(req.params.id);
        if (!species) {
            return sendResponse(res, 404, false, "Species not found");
        }
        await Species.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, true, "Species deleted successfully");
    } catch (error) {
        sendResponse(res, 500, error);
    }
};



