import { Router } from "express";
import { createDepartment, deleteDepartment, getDepartment, getDepartments, searchDepartments, updateDepartment } from "../../controllers/Admin/department.controller.js";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

// search by name 
router.get("/search/by", searchDepartments)


export default router;
