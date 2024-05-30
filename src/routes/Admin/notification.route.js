import { Router } from "express";
import {
    deleteNotificationById,
    deleteNotifications,
    getAllNotifications,
    seenNotificationById,
} from "../../controllers/Admin/notification.controller.js";

const router = Router();

// notification by department and role
router.get("/", getAllNotifications);
router.delete("/", deleteNotifications);
router.delete("/:id", deleteNotificationById);
router.patch("/:id", seenNotificationById);

export default router;
