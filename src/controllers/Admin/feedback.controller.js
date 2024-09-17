import Feedback from "../../models/feedback.model.js";
import sendResponse from "../../utils/sendResponse.js";

// admin can edit the feedback and delete the feedback
export const editFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return sendResponse(res, 404, false, "Feedback not found");
    }

    if (req.body.feedback) {
      feedback.feedback = req.body.feedback;
    }

    if (req.body.rating) {
      feedback.rating = req.body.rating;
    }

    if (req.body.is_published) {
      feedback.is_published = req.body.is_published;
    }

    await feedback.save();
    sendResponse(res, 200, true, "Feedback updated successfully", feedback);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return sendResponse(res, 404, false, "Feedback not found");
    }

    await Feedback.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Feedback deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const feedbacks = await Feedback.find()
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName");

    // count total feedbacks
    const count = await Feedback.countDocuments();
    const totalPages = Math.ceil(count / limit);
    sendResponse(res, 200, true, "All feedbacks", {
      data: feedbacks,
      totalPages,
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
