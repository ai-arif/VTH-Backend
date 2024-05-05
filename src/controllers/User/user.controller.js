import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

//@desc Register User
//@route POST /api/v1/user/register
//@access private user



const registerUserCtrl = AsyncHandler(async (req, res, next) => {
  const { fullName, phone, password } = req.body;

  if ([fullName, phone, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Required Field Missing");
  }

  const existedUser = await User.findOne({
    $or: [{ phone }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ fullName, phone, password });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating account");
  }

  return res
    .status(201)
    .json(new ApiResponse((201, createdUser, "User created successfully")));
});

//@desc Login User
//@route POST /api/v1/user/login
//@access private user

const loginUserCtrl = AsyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone) {
    throw new ApiError(400, "Phone Number is Required");
  }

  const user = await User.findOne({ $or: [{ phone }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in Successfully"
      )
    );
});

//@desc Logout User
//@route POST /api/v1/user/logout
//@access private user

const logoutUserCtrl = AsyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//@desc Change Current Password
//@route POST /api/v1/user/change-password
//@access private user

const changeCurrentPasswordCtrl = AsyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  registerUserCtrl,
  loginUserCtrl,
  logoutUserCtrl,
  changeCurrentPasswordCtrl,
};
