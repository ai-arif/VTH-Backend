import Department from "../../models/department.model.js";
import Admin from "../../models/admin.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";


export const createDepartment = AsyncHandler(async (req, res) => {
    const { name } = req.body;
    try {
        const department = await Department.findOne({ name });
        if (department) {
            return sendResponse(res, 400, false, "Department already exists");
        }
        const newDepartment = new Department({
            name,
        });
        await newDepartment.save();
        return sendResponse(res, 201, true, "Department created successfully", {
            name: newDepartment.name,
        });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});

export const getDepartments = AsyncHandler(async (req, res) => {
    try {
        const departments = await Department.find();
        return sendResponse(res, 200, true, "Departments fetched successfully", departments);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});