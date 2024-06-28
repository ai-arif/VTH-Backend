import Breed from "../../models/breed.model.js";
import Species from "../../models/species.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";

export const createBreed = async (req, res) => {
  try {
    const breed = new Breed(req.body);
    const result = await breed.save();

    if (result) {
      const speciesInfo = await Species.findById(req.body?.species);

      const title = `New breed added`;
      const description = `A new breed '${result.breed}' has been added to species '${speciesInfo?.name}'.`;
      const department = null;
      const type = "admin";
      const destinationUrl = `/species-breeds/breeds`;

      const notify = await createNotification(
        title,
        description,
        department,
        type,
        destinationUrl
      );
    }
    sendResponse(res, 201, true, "Breed created successfully");
  } catch (error) {
    console.log({ error });
    sendResponse(res, 500, error);
  }
};

export const getBreeds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const sort = -1;

    const breed = await Breed.find()
      .populate("species")
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    const totalCount = await Breed.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    sendResponse(res, 200, true, "Breeds fetched successfully", {
      data: breed,
      totalPages,
      page,
    });
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const getBreedById = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id).populate("species");
    if (!breed) {
      return sendResponse(res, 404, false, "Breed not found");
    }
    sendResponse(res, 200, true, "Breed fetched successfully", breed);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const updateBreed = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);
    if (!breed) {
      return sendResponse(res, 404, false, "Breed not found");
    }
    const updatedData = req.body;
    await Breed.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    sendResponse(res, 200, true, "Breed updated successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const deleteBreed = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);
    if (!breed) {
      return sendResponse(res, 404, false, "Breed not found");
    }
    await Breed.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Breed deleted successfully");
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

export const getBreedsBySpecies = async (req, res) => {
  try {
    const breed = await Breed.find({
      species: req.params.speciesId,
    }).populate("species");
    sendResponse(res, 200, true, "Breeds fetched successfully", breed);
  } catch (error) {
    sendResponse(res, 500, error);
  }
};
