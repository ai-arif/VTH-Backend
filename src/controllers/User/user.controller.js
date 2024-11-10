import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendEmail from "../../utils/sendMail.js";
import sendResponse from "../../utils/sendResponse.js";

export const createUser = AsyncHandler(async (req, res) => {
  const {
    fullName,
    password,
    phone,
    district,
    upazila,
    address,
    nid,
    division,
  } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      password: hashedPassword,
      phone,
      district,
      division,
      upazila,
      address,
      nid,
    });

    await newUser.save();

    const token = Jwt.sign(
      { id: newUser._id },
      //   process.env.ACCESS_TOKEN_SECRET
      process.env.ACCESS_TOKEN_USER_SECRET
    );

    return sendResponse(res, 201, true, "User created successfully", {
      _id: newUser._id,
      fullName: newUser.fullName,
      phone: newUser.phone,
      token,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});

export const loginUser = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const token = Jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_USER_SECRET
    );
    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const users = await User.find().select("-password").limit(limit).skip(skip);
    return sendResponse(res, 200, true, "All users", users);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// update user const { fullName,  phone, district, upazila, address, nid } = req.body;
export const updateUser = async (req, res) => {
  const user = req.id;
  const { fullName, phone, district, upazila, address, nid, email, division } =
    req.body;
  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    existingUser.fullName = fullName;
    existingUser.phone = phone;
    existingUser.district = district;
    existingUser.division = division;
    existingUser.upazila = upazila;
    existingUser.address = address;
    existingUser.nid = nid;
    existingUser.email = email;
    let message = "";
    // check if all fileds are filled the isCompleted will be true, otherwise give message which fields are missing
    if (fullName && phone && district && upazila && address && division) {
      existingUser.isCompleted = true;
    } else {
      // mention which fields are missing
      if (!fullName) message += "Full name is required, \n";
      if (!phone) message += "Phone number is required, \n";
      if (!district) message += "District is required, \n";
      if (!division) message += "Division is required, \n";
      if (!upazila) message += "Upazila is required, \n";
      if (!address) message += "Address is required, \n";
    }
    await existingUser.save();
    return sendResponse(res, 200, true, "User updated successfully", {
      message,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// change password
export const changePassword = async (req, res) => {
  const user = req.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return sendResponse(res, 400, false, "Invalid credentials");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;

    await existingUser.save();
    return sendResponse(res, 200, true, "Password changed successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getUserById = async (req, res) => {
  const user = req.id;
  try {
    const existingUser = await User.findById(user).select("-password");
    if (!existingUser) {
      return sendResponse(res, 404, false, "User not found");
    }
    return sendResponse(res, 200, true, "User", existingUser);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    // create a token
    // generate a token for 1hr
    // write code to generate here
    const resetToken = await Jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_USER_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // console.log(resetUrl);
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
    try {
      await sendEmail(user.email, "Password reset request", message);
      return sendResponse(res, 200, true, "Email sent");
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return sendResponse(res, 500, false, "Email could not be sent");
    }
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.resetToken;
  try {
    if (!resetToken) {
      return sendResponse(res, 400, false, "Invalid token");
    }

    const decoded = Jwt.verify(
      resetToken,
      process.env.ACCESS_TOKEN_USER_SECRET
    );
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return sendResponse(res, 200, true, "Password reset successful");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
