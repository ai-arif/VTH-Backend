import { Router } from "express";

import {
  createUser,
  loginUser,
  getUser,

} from "../../controllers/User/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", verifyJWT, getUser);


export default userRouter;