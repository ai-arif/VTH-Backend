import { Router } from "express";
import {
  editFeedback,
  deleteFeedback,
} from "../../controllers/Admin/feedback.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.put("/:id", verifyAdminToken, editFeedback);
router.delete("/:id", verifyAdminToken, deleteFeedback);

export default router;
