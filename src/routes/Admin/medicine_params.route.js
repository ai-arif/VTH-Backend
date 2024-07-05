import { Router } from "express";
import {
  createMedicineParams,
  deleteMedicineParam,
  getMedicineParam,
  getMedicineParams,
  updateMedicineParam,
} from "../../controllers/Admin/medicine_params.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const medicineParamRouter = Router();

medicineParamRouter.post("/", createMedicineParams);
medicineParamRouter.get("/", getMedicineParams);
medicineParamRouter.get("/:id", getMedicineParam);
medicineParamRouter.put("/:id", updateMedicineParam);
medicineParamRouter.delete("/:id", deleteMedicineParam);

export default medicineParamRouter;
