import { Router } from "express";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const prescriptionRouter = Router();

import {
  Create,
  Deleteby,
  Find,
  FindBy,
  GetPrescriptionWhichHasTest,
  GetPrescriptionWhichHasTestById,
  Search,
  SearchBy,
  Updateby,
  updatePrescriptionTestStatus,
} from "../../controllers/Admin/prescription.controller.js";

prescriptionRouter.post("/", verifyAdminToken, Create);
prescriptionRouter.get("/", Find);
prescriptionRouter.get("/:id", FindBy);
prescriptionRouter.put("/:id", verifyAdminToken, Updateby);
prescriptionRouter.delete("/:id", Deleteby);
prescriptionRouter.get("/search/by", SearchBy);

// for lab test
prescriptionRouter.get("/lab/test", GetPrescriptionWhichHasTest);
prescriptionRouter.get("/lab/test/:id", GetPrescriptionWhichHasTestById);
// update status in prescription for test result status
prescriptionRouter.patch("/lab/test/:id", updatePrescriptionTestStatus);

export default prescriptionRouter;
