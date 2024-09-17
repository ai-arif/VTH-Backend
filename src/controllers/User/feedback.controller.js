import Feedback from "../../models/feedback.model.js";
import sendResponse from "../../utils/sendResponse.js";

// user is req.id;
export const createFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    const user = req.id;
    if (!user) {
      return sendResponse(
        res,
        400,
        false,
        "Must be logged in to create feedback"
      );
    }

    const newFeedback = await Feedback.create({ user, feedback, rating });
    sendResponse(res, 201, true, "Feedback created successfully", newFeedback);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ is_published: true }).populate(
      "user",
      "fullName"
    );
    sendResponse(res, 200, true, "All feedbacks", feedbacks);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "user",
      "fullName"
    );
    if (!feedback) {
      return sendResponse(res, 404, false, "Feedback not found");
    }
    sendResponse(res, 200, true, "Feedback", feedback);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};
// get logged in user feedbacks
export const getUserFeedbacks = async (req, res) => {
  try {
    const user = req.id;
    if (!user) {
      return sendResponse(
        res,
        400,
        false,
        "Must be logged in to get feedbacks"
      );
    }

    const feedbacks = await Feedback.find({ user }).populate(
      "user",
      "fullName"
    );
    sendResponse(res, 200, true, "Your feedbacks", feedbacks);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return sendResponse(res, 404, false, "Feedback not found");
    }

    if (feedback.user.toString() !== req.id) {
      return sendResponse(res, 403, false, "You are not authorized to update");
    }
    feedback.feedback = req.body.feedback || feedback.feedback;
    feedback.rating = req.body.rating || feedback.rating;

    const updatedFeedback = await feedback.save();
    sendResponse(
      res,
      200,
      true,
      "Feedback updated successfully",
      updatedFeedback
    );
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// findby id and delete
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
