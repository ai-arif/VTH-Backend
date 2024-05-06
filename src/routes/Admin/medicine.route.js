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

router.post("/", verifyAdminToken, addMedicine);
router.get("/", verifyAdminToken, getMedicine);
router.put("/:id", verifyAdminToken, updateMedicine);
router.delete("/:id", verifyAdminToken, deleteMedicine);
router.get("/:id", verifyAdminToken, getMedicineById);

export default router;
