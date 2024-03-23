import { Router } from "express";

import {
  registerUserCtrl,
  loginUserCtrl,
  logoutUserCtrl,
  changeCurrentPasswordCtrl,

} from "../../controllers/User/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUserCtrl);
userRouter.route("/login").post(loginUserCtrl);
userRouter.route("/logout").post(verifyJWT, logoutUserCtrl);
userRouter.route("/change-password").put(verifyJWT, changeCurrentPasswordCtrl);


export { userRouter };
