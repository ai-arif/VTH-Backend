import {getDepartments, createDepartment,deleteDepartment,getDepartment,updateDepartment} from "../../controllers/Admin/department.controller.js";
import { Router } from "express";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/",  createDepartment);
router.get("/",  getDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);


export default router;
