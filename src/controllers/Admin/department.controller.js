import Admin from "../../models/admin.model.js";
import Department from "../../models/department.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";


export const createDepartment = AsyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = req.id;
    try {
        const department = await Department.findOne({ name });
        if (department) {
            return sendResponse(res, 400, false, "Department already exists");
        }
        const newDepartment = new Department({
            name,
            createdBy: user
        });
        await newDepartment.save();
        return sendResponse(res, 201, true, "Department created successfully", {
            name: newDepartment.name,
        });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});


// get departments with pagination
export const getDepartments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sort = -1;
        const departments = await Department.find()
            .populate('createdBy', 'fullName')
            .sort({ createdAt: sort })
            .limit(limit)
            .skip(skip);

        return sendResponse(res, 200, true, "Showing results", departments);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// get department by id
export const getDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findById(id).populate('createdBy', 'fullName');
        if (!department) {
            return sendResponse(res, 404, false, "Department not found");
        }
        return sendResponse(res, 200, true, "Showing result", department);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// update department by id
export const updateDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findById(id);
        if (!department) {
            return sendResponse(res, 404, false, "Department not found");
        }
        await Department.updateOne({ _id: id }, { ...req.body });
        return sendResponse(res, 200, true, "Updated successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

// delete department by id
export const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findById(id);
        if (!department) {
            return sendResponse(res, 404, false, "Department not found");
        }
        await Department.deleteOne({
            _id: id
        });
        return sendResponse(res, 200, true, "Deleted successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

// get departments with pagination
export const searchDepartments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sort = -1;

        const search = req.query?.search;

        if (!search) {
            return sendResponse(res, 500, false, "Search params is required!")
        }

        const departmentsCount = await Department.find({ name: { $regex: search, $options: 'i' } });
        const totalPages = Math.ceil(departmentsCount?.length / limit)

        const departments = await Department.find({ name: { $regex: search, $options: 'i' } })
            .populate('createdBy')
            .sort({ createdAt: sort })
            .limit(limit)
            .skip(skip);

        return sendResponse(res, 200, true, "Showing results", { data: departments, totalPages });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};