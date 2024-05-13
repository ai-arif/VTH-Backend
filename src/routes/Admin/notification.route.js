import { Router } from "express";
import {
    getAllNotifications,
    deleteNotifications
    } from "../../controllers/Admin/notification.controller.js";

const router = Router();

router.get("/",  getAllNotifications);
router.delete("/",  deleteNotifications);

export default router;
