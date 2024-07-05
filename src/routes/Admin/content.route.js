import { Router } from "express";
import {
  deleteContent,
  createContent,
  getContent,
  getContentById,
  updateContent,
} from "../../controllers/Admin/content.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
import { configureMulter } from "../../utils/multerConfig.js";
const contentRouter = Router();
const upload = configureMulter("uploads");

contentRouter.post(
  "/",
  verifyAdminToken,
  upload.single("image"),
  createContent
);
contentRouter.get("/", verifyAdminToken, getContent);
contentRouter.get("/:id", verifyAdminToken, getContentById);
contentRouter.put("/:id", verifyAdminToken, updateContent);
contentRouter.delete("/:id", verifyAdminToken, deleteContent);

export default contentRouter;
