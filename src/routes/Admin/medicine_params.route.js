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

medicineParamRouter.post("/", verifyAdminToken, createMedicineParams);
medicineParamRouter.get("/", verifyAdminToken, getMedicineParams);
medicineParamRouter.get("/:id", verifyAdminToken, getMedicineParam);
medicineParamRouter.put("/:id", verifyAdminToken, updateMedicineParam);
medicineParamRouter.delete("/:id", verifyAdminToken, deleteMedicineParam);

export default medicineParamRouter;
