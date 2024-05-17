import { User } from "../../models/user.model.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";

export const createUser = AsyncHandler(async (req, res) => {
    const { fullName, password, phone, district, upazila, address, nid } = req.body;
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
            upazila,
            address,
            nid,
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
    const { fullName, phone, district, upazila, address, nid } = req.body;
    try {
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return sendResponse(res, 404, false, "User not found");
        }

        existingUser.fullName = fullName;
        existingUser.phone = phone;
        existingUser.district = district;
        existingUser.upazila = upazila;
        existingUser.address = address;
        existingUser.nid = nid;
        let message = "";
        // check if all fileds are filled the isCompleted will be true, otherwise give message which fields are missing
        if (fullName && phone && district && upazila && address) {
            existingUser.isCompleted = true;
        }
        else {
            // mention which fields are missing
            if (!fullName) message += "Full name is required, \n";
            if (!phone) message += "Phone number is required, \n";
            if (!district) message += "District is required, \n";
            if (!upazila) message += "Upazila is required, \n";
            if (!address) message += "Address is required, \n";


        }
        await existingUser.save();
        return sendResponse(res, 200, true, "User updated successfully", { message });
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
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}


export const getUserById = async (req, res) => {
    const user = req.id
    try {
        const existingUser = await User.findById(user).select("-password");
        if (!existingUser) {
            return sendResponse(res, 404, false, "User not found");
        }
        return sendResponse(res, 200, true, "User", existingUser);
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}
