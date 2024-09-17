import { Router } from "express";
import {
  changeStaffPassword,
  createAdmin,
  createUser,
  deleteAdmin,
  getAllAdmins,
  getAllUsers,
  getLoginStaffOrAdmin,
  getProfile,
  getUserByPhone,
  login,
  searchAllStaffs,
  updateAdmin,
  resetPassword,
  forgotPassword,
  getTotalAmountsByDateRange,
} from "../../controllers/Admin/admin.controller.js";

import verifyAdminToken from "../../middlewares/verifyAdminToken.js";
const router = Router();
router.get("/total-amount", getTotalAmountsByDateRange);
router.get("/admins", getAllAdmins);

router.post("/create-admin", createAdmin);
router.post("/create-staff", verifyAdminToken, createUser);
router.post("/login", login);
router.get("/", verifyAdminToken, getProfile);
router.get("/user/:phone", getUserByPhone);
router.get("/users", getAllUsers);
router.put("/update-admin/:id", verifyAdminToken, updateAdmin);
router.delete("/delete-admin/:id", deleteAdmin);

// staff search
router.get("/admins/search", searchAllStaffs);
router.patch("/:id", changeStaffPassword);

router.post("/reset-password", resetPassword);
router.post("/forget-password", forgotPassword);
// get login staff/admin data to do
router.get("/:id", getLoginStaffOrAdmin);

export default router;
