import { Router } from "express";
import {
    addMedicine,
    getMedicine,
    updateMedicine,
    deleteMedicine,
    getMedicineById
    } from "../../controllers/Admin/medicine.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/",  addMedicine);
router.get("/",  getMedicine);
router.put("/:id",  updateMedicine);
router.delete("/:id",  deleteMedicine);
router.get("/:id",  getMedicineById);

export default router;
