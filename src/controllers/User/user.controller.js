import { User } from "../../models/user.model.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";

export const createUser = AsyncHandler(async (req, res) => {
    const { fullName, password, phone } = req.body;
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
        });

        await newUser.save();

        const token = Jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

        return sendResponse(res, 201, true, "User created successfully", {
            _id: newUser._id,
            fullName: newUser.fullName,
            phone: newUser.phone,
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

        const token = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_USER_SECRET);
        return sendResponse(res, 200, true, "Login successful", { token });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password");
        return sendResponse(res, 200, true, "User", user);
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


