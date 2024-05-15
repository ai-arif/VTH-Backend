import { Router } from "express";
import {
    createAdmin,
    createUser,
    login,
    getProfile,
    getAllAdmins,
    getUserByPhone,
    getAllUsers,
    updateAdmin,
    deleteAdmin
    } from "../../controllers/Admin/admin.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/create-admin",  createAdmin);
router.post("/create-staff",  createUser);
router.post("/login", login);
router.get("/", verifyAdminToken, getProfile);
router.get("/admins",  getAllAdmins);
router.get("/user/:phone",  getUserByPhone);
router.get("/users",  getAllUsers);
router.put("/update-admin",  updateAdmin);
router.delete("/delete-admin/:id",  deleteAdmin);





export default router;