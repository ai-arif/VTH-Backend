import { Router } from "express";
import {
    deleteNotifications,
    getAllNotifications,
} from "../../controllers/Admin/notification.controller.js";

const router = Router();

// notification by department and role
router.get("/", getAllNotifications);
router.delete("/", deleteNotifications);

export default router;
