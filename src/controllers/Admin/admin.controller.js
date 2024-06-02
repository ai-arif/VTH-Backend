import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Admin from "../../models/admin.model.js";
import Department from "../../models/department.model.js";
import { User } from "../../models/user.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import { createNotification } from "./notification.controller.js";
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
});

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
      department, // Add department here
    });

    // Check if department ID is present
    if (department) {
      // Check if department with given ID exists
      const existingDepartment = await Department.findById(department);
      if (!existingDepartment) {
        return sendResponse(res, 400, false, "Department not found");
      }
    }

    const createdUSer = await newUser.save();

    const token = Jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET
    );

    if (department && createdUSer) {
      const departmentInfo = await Department.findById(department);

      const title = `New joining!`;
      const description = `'${fullName}' join as a new ${role} to ${departmentInfo?.name} department`;
      // const department = department;
      const type = "admin";

      const notify = await createNotification(
        title,
        description,
        department,
        type
      );
      // console.log({ notify })
    }

    return sendResponse(res, 201, true, "User created successfully", {
      _id: newUser._id,
      fullName: newUser.fullName,
      phone: newUser.phone,
      role: newUser.role,
      department: newUser.department, // Include department in response
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// to do
export const getLoginStaffOrAdmin = async (req, res) => {
  try {
    if (req.params?.id) {
      const user = await Admin.findById(req.params?.id).select("-password");
      return sendResponse(res, 200, true, "User", user);
    }
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

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
    const token = Jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    return sendResponse(res, 200, true, "Login successful", { token });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// to do to fix
export const getProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.id).select("-password");
    return sendResponse(res, 200, true, "User", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    // use page, limit, sort form query
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const users = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    // send pages
    const count = await Admin.countDocuments();
    const pages = Math.ceil(count / limit);
    return sendResponse(res, 200, true, "All users", {
      users,
      totalPages: pages,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// search all staffs *************
export const searchAllStaffs = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res
        .status(500)
        .json({ success: false, message: "Search query needed!" });
    }

    // send with total pages
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;

    const conditions = [
      { fullName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];

    const query = {
      $or: conditions,
    };

    const users = await Admin.find(query)
      .sort({ createdAt: sort })
      .select("-password")
      .limit(limit)
      .skip(skip);
    // send pages
    const count = await Admin.countDocuments(query);
    const pages = Math.ceil(count / limit);

    sendResponse(res, 200, true, "Showing results", {
      users,
      totalPages: pages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return sendResponse(res, 404, false, "Admin not found");
    }

    return sendResponse(res, 200, true, "Admin deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

export const getUserByPhone = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone }).select(
      "-password"
    );
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    return sendResponse(res, 200, true, "User", user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// get all users, except password
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "All users", users);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// update admin, if password is present, hash it and update
export const updateAdmin = async (req, res) => {
  try {
    const { fullName, password, phone, role } = req.body;
    const id = req.params.id;
    const admin = await Admin.findById(id);
    if (!admin) {
      return sendResponse(res, 404, false, "Admin not found");
    }
    if (fullName) {
      admin.fullName = fullName;
    }
    if (phone) {
      admin.phone = phone;
    }
    if (role) {
      admin.role = role;
    }
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();
    return sendResponse(res, 200, true, "Admin updated successfully", {
      fullName: admin.fullName,
      phone: admin.phone,
      role: admin.role,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
