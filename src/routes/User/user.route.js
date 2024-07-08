import { Router } from "express";

import {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  getAllUsers,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../../controllers/User/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.get("/profile", verifyJWT, getUserById);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.put("/update", verifyJWT, updateUser);
userRouter.get("/all", verifyJWT, getAllUsers);
userRouter.put("/change-password", verifyJWT, changePassword);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:resetToken", resetPassword);

export default userRouter;
