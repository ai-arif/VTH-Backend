import Logo from "../../models/logo.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { uploadFileToGCS } from "../../utils/multerConfig.js";

export const createLogo = AsyncHandler(async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      image = await uploadFileToGCS(req.file.buffer, req.file.originalname);
    }
    const newLogo = new Logo({
      image,
    });
    await newLogo.save();
    return sendResponse(res, 201, true, "Logo created successfully", {
      image: newLogo.image,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

// get all logos
export const getLogos = AsyncHandler(async (req, res) => {
  try {
    const logos = await Logo.find();
    return sendResponse(res, 200, true, "Logos fetched successfully", logos);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

// delete logo
export const deleteLogo = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const logo = await Logo.findById(id);
    if (!logo) {
      return sendResponse(res, 404, false, "Logo not found");
    }
    await logo.remove();
    return sendResponse(res, 200, true, "Logo deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});
