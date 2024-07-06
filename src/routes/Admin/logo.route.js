import { Router } from "express";
import {
  createLogo,
  getLogos,
  deleteLogo,
} from "../../controllers/Admin/logo.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
import { configureMulter } from "../../utils/multerConfig.js";
const upload = configureMulter("uploads");

const logoRouter = Router();

logoRouter.post("/", verifyAdminToken, upload.single("image"), createLogo);
logoRouter.get("/", verifyAdminToken, getLogos);
logoRouter.delete("/:id", verifyAdminToken, deleteLogo);

export default logoRouter;
