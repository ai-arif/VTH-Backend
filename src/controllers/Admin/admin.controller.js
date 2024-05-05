import Admin from "../../models/admin.model.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Department from "../../models/department.model.js";
// const sendResponse = (res, statusCode,success, message, data) => {
//     res.status(statusCode).json({success, message, data });
//     };

export const createAdmin = AsyncHandler(async (req, res) => {
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
  })

  export const createUser = async (req, res) => {
    const { fullName, password, phone, role, department } = req.body;
    try {
        if (!fullName || !password || !phone || !role) {
            return sendResponse(res, 400, false, "All fields are required");
        }

        const user = await Admin.findOne({ phone });
        if (user) {
            return sendResponse(res, 400, false, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Admin({
            fullName,
            password: hashedPassword,
            phone,
            role,
            department // Add department here
        });

        // Check if department ID is present
        if (department) {
            // Check if department with given ID exists
            const existingDepartment = await Department.findById(department);
            if (!existingDepartment) {
                return sendResponse(res, 400, false, "Department not found");
            }
        }

        await newUser.save();

        const token = Jwt.sign({ id: newUser._id, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET);

        return sendResponse(res, 201, true, "User created successfully", {
            _id: newUser._id,
            fullName: newUser.fullName,
            phone: newUser.phone,
            role: newUser.role,
            department: newUser.department // Include department in response
        });
    } catch (error) {
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

export const getUser=async(req,res)=>{
    try{
        const user=await Admin.findById(req.id).select("-password");
        return sendResponse(res,200,true,"User",user);
    }
    catch(error){
        return sendResponse(res,500,false,error.message);
    }
}

export const getAllUsers=async(req,res)=>{
    try{
        // use page, limit, sort form query
        const limit=parseInt(req.query.limit)||15;
        const page=parseInt(req.query.page)||1;
        const skip=(page-1)*limit;
        const users=await Admin.find().select("-password").limit(limit).skip(skip);
        return sendResponse(res,200,true,"All users",users);
    }
    catch(error){
        return sendResponse(res,500,false,error.message);
    }
}
    
