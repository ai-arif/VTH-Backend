import { Router } from "express";
import { getHomeContent } from "../../controllers/User/home.controller.js";
const homeRouter = Router();

homeRouter.get("/", getHomeContent);

export default homeRouter;
