import {getDepartments, createDepartment} from "../../controllers/Admin/department.controller.js";
import { Router } from "express";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/",  createDepartment);
router.get("/",  getDepartments);

export default router;
