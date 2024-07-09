import { Router } from "express";
import {
    addMedicine,
    deleteMedicine,
    getMedicine,
    getMedicineById,
    getMedicinesBrandName,
    searchMedicine,
    updateMedicine
} from "../../controllers/Admin/medicine.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/", addMedicine);
router.get("/", getMedicine);
router.get("/brand-name", getMedicinesBrandName);
router.get("/search", searchMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.get("/:id", getMedicineById);

export default router;
