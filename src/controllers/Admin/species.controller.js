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
      const destinationUrl = `/species-complaints/species`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 201, true, "Species created successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const getSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const sort = -1;
    const species = await Species.find()
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const totalCount = await Species.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    sendResponse(res, 200, true, "Species fetched successfully", {
      data: species,
      totalPages,
      page,
    });
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
  } catch (error) {
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
      const destinationUrl = `/species-complaints/species`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
      // console.log({ notify })
    }

    sendResponse(res, 200, true, "Species deleted successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const searchSpecies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const sort = -1;
  const search = req.query.search;

  if (!search) {
    return sendResponse(res, 500, false, "Search params is required!");
  }

  try {
    const totalCount = await Species.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    const totalPages = Math.ceil(totalCount / limit);

    const species = await Species.find({
      name: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit);

    sendResponse(res, 200, true, "Successfully fetched  species", {
      totalCount,
      totalPages,
      page: page,
      data: species,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
