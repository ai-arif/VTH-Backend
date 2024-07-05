import Content from "../../models/content.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { uploadFileToGCS } from "../../utils/multerConfig.js";
// create content controller it may have image or video link, if image then upload to gcs, if video link then save it

export const createContent = AsyncHandler(async (req, res) => {
  const { title, description, video, type } = req.body;
  try {
    let image = "";

    if (req.file) {
      image = await uploadFileToGCS(req.file.buffer, req.file.originalname);
    }
    const newContent = new Content({
      title,
      description,
      video,
      image,
      type,
    });
    await newContent.save();
    return sendResponse(res, 201, true, "Content created successfully", {
      title: newContent.title,
      description: newContent.description,
      video: newContent.video,
      image: newContent.image,
      type: newContent.type,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const getContent = AsyncHandler(async (req, res) => {
  try {
    const content = await Content.find();
    return sendResponse(
      res,
      200,
      true,
      "Content fetched successfully",
      content
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const getContentById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const content = await Content.findById(id);
    if (!content) {
      return sendResponse(res, 404, false, "Content not found");
    }
    return sendResponse(
      res,
      200,
      true,
      "Content fetched successfully",
      content
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const updateContent = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, video, type, enable } = req.body;
  try {
    const content = await Content.findById(id);
    if (!content) {
      return sendResponse(res, 404, false, "Content not found");
    }
    let image = content.image;
    if (req.file) {
      image = await uploadFileToGCS(req.file);
    }
    content.title = title;
    content.description = description;
    content.video = video;
    content.image = image;
    content.type = type;
    content.enable = enable;
    await content.save();
    return sendResponse(res, 200, true, "Content updated successfully", {
      title: content.title,
      description: content.description,
      video: content.video,
      image: content.image,
      type: content.type,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const deleteContent = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // findbyid and delete
    const content = await Content.findByIdAndDelete(id);
    if (!content) {
      return sendResponse(res, 404, false, "Content not found");
    }
    return sendResponse(res, 200, true, "Content deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});
