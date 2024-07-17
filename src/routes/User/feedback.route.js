import { Router } from "express";
import {
  createFeedback,
  deleteFeedback,
  getUserFeedbacks,
  getFeedback,
  updateFeedback,
} from "../../controllers/User/feedback.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const feedbackRouter = Router();

feedbackRouter.post("/", verifyJWT, createFeedback);
feedbackRouter.get("/", verifyJWT, getUserFeedbacks);
feedbackRouter.get("/:id", getFeedback);
feedbackRouter.put("/:id", verifyJWT, updateFeedback);
feedbackRouter.delete("/:id", verifyJWT, deleteFeedback);

export default feedbackRouter;
