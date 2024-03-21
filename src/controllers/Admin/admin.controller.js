import Admin from "../../models/admin.model";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendResponse from "../../utils/sendResponse";

// const sendResponse = (res, statusCode,success, message, data) => {
//     res.status(statusCode).json({success, message, data });
//     };

export const createAdmin = async (req, res) => {
  const { fullName, password, phone } = req.body;
  try {
    const admin = await Admin.findOne({ phone });
    if (admin) {
      return sendResponse(res, 400, false, "Admin already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      fullName,
      password: hashedPassword,
      phone,
      role: "admin",
    });
    await newAdmin.save();
    return sendResponse(res, 201, true, "Admin created successfully", {
        fullName: newAdmin.fullName,
        phone: newAdmin.phone,

    });
    } catch (error) {
    return sendResponse(res, 500, false, error.message);
    }
}

export const createUser = async (req, res) => {
    const { fullName, password, phone, role } = req.body;
    try {
        const user = await Admin.findOne({ phone });
        if (user) {
            return sendResponse(res, 400, false, "User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Admin({
            fullName,
            password: hashedPassword,
            phone,
            role
        });
        await newUser.save();
        const token=Jwt.sign({id:newUser._id,role:newUser.role},process.env.ACCESS_TOKEN_SECRET);
        return sendResponse(res, 201, true, "User created successfully", {
            fullName: newUser.fullName,
            phone: newUser.phone,
        });
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const login = async (req, res) => {
    const { phone, password } = req.body;
    try {
        const admin = await Admin.findOne({ phone });
        if (!admin) {
            return sendResponse(res, 400, false, "Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return sendResponse(res, 400, false, "Invalid credentials");
        }
        const token = Jwt.sign({ id: admin._id, role: admin.role }, process.env.ACCESS_TOKEN_SECRET);
        return sendResponse(res, 200, true, "Login successful", { token });
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}
    
