import {getDepartments, createDepartment} from "../../controllers/Admin/department.controller.js";
import { Router } from "express";
import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/create",  createDepartment);
router.get("/",  getDepartments);

export default router;
