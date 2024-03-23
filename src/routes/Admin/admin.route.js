import { Router } from "express";
import {
    createAdmin,
    createUser,
    login,
    getUser,
    getAllUsers
    } from "../../controllers/Admin/admin.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

router.post("/create-admin",  createAdmin);
router.post("/create-user", verifyAdminToken, createUser);
router.post("/login", login);
router.get("/user", verifyAdminToken, getUser);
router.get("/users", verifyAdminToken, getAllUsers);





export default router;