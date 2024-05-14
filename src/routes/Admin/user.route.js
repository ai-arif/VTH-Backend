import {getUserById, getUserByPhone, searchUsers, getAllUsers} from "../../controllers/Admin/user.controller.js";
import {Router} from "express";

const router = Router();

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/phone/:phone", getUserByPhone);
router.get("/:id", getUserById);

export default router;