import { Router } from "express";
import {
    createAdmin,
    createUser,
    deleteAdmin,
    getAllAdmins,
    getAllUsers,
    getLoginStaffOrAdmin,
    getProfile,
    getUserByPhone,
    login,
    searchAllAppointments,
    updateAdmin
} from "../../controllers/Admin/admin.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();

// get login staff/admin data to do
router.get('/:id', getLoginStaffOrAdmin);

router.post("/create-admin", createAdmin);
router.post("/create-staff", createUser);
router.post("/login", login);
router.get("/", verifyAdminToken, getProfile);
router.get("/admins", getAllAdmins);
router.get("/user/:phone", getUserByPhone);
router.get("/users", getAllUsers);
router.put("/update-admin/:id", updateAdmin);
router.delete("/delete-admin/:id", deleteAdmin);



// staff search 
router.get("/admins/search", searchAllAppointments);





export default router;