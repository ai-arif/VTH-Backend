import { Router } from "express";
import {
    createAdmin,
    createUser,
    login,
    getProfile,
    getAllAdmins,
    getUserByPhone,
    getAllUsers
    } from "../../controllers/Admin/admin.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/create-admin",  createAdmin);
router.post("/create-user", verifyAdminToken, createUser);
router.post("/login", login);
router.get("/", verifyAdminToken, getProfile);
router.get("/admins", verifyAdminToken, getAllAdmins);
router.get("/user/:phone",  getUserByPhone);
router.get("/users",  getAllUsers);





export default router;