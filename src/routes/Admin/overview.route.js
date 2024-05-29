import { Router } from "express";
import { getOverview } from "../../controllers/Admin/overview.controller.js";

export const overviewRoute = Router();

overviewRoute.get("/", getOverview);