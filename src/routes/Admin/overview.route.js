import { Router } from "express";
import { getMorbidityOverview, getOverview, getOverview2 } from "../../controllers/Admin/overview.controller.js";

export const overviewRoute = Router();

overviewRoute.get("/", getOverview);
overviewRoute.get("/species-department", getOverview2);
overviewRoute.get("/morbidity", getMorbidityOverview);