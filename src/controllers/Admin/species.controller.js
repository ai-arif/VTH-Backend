import Species from "../../models/species.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const createSpecies = async (req, res) => {
    try {
        const species = new Species(req.body);
        const result = await species.save();

        if (result) {
            // const departmentInfo = await Department.findById(department);

            const title = `New specie added`;
            const description = `'${result?.name}' has been as new species`;
            const department = null;
            const type = "admin";
            const destinationUrl = `/species-complaints/species`

            const notify = await createNotification(title, description, department, type, destinationUrl);
            // console.log({ notify })
        }

        sendResponse(res, 201, true, "Species created successfully");
    } catch (error) {
        sendResponse(res, 500, error);
    }
};

export const getSpecies = async (req, res) => {
    try {
        const species = await Species.find().sort({ createdAt: -1 });
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
        const result = await Species.findByIdAndDelete(req.params.id);

        if (result) {
            // const departmentInfo = await Department.findById(department);

            const title = `A specie deleted`;
            const description = `'${species?.name}' has been from species list.`;
            const department = null;
            const type = "admin";
            const destinationUrl = `/species-complaints/species`

            const notify = await createNotification(title, description, department, type, destinationUrl);
            // console.log({ notify })
        }

        sendResponse(res, 200, true, "Species deleted successfully");
    } catch (error) {
        sendResponse(res, 500, error);
    }
};



