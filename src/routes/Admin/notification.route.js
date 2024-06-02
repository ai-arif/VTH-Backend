import { Router } from "express";
import {
    deleteNotificationById,
    deleteNotifications,
    getAllNotifications,
    seenAllNotifications,
    seenNotificationById,
} from "../../controllers/Admin/notification.controller.js";

const router = Router();

// notification by department and role
router.get("/", getAllNotifications);
router.delete("/", deleteNotifications);
router.delete("/:id", deleteNotificationById);
router.patch("/:id", seenNotificationById);
router.patch("/", seenAllNotifications);

export default router;
