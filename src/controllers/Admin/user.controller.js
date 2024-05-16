import { User } from "../../models/user.model.js";
import sendResponse from "../../utils/sendResponse.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";

// get all users with proper pagination , with total count of pages
export const getAllUsers = AsyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const users = await User.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: sort });

    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / limit);

    return sendResponse(res, 200, true, "Showing results", { users, totalPages });
});

// search users by phone and name with pagination, and total count of pages for that logic
export const searchUsers = AsyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = -1;
    const search = req.query.search;
    
    const users = await User.find({
        $or: [
            { fullName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ],
    })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: sort });

    const count = await User.countDocuments({
        $or: [
            { fullName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ],
    });
    const totalPages = Math.ceil(count / limit);

    return sendResponse(res, 200, true, "Showing results", { users, totalPages });
});

// get user by phone
export const getUserByPhone = AsyncHandler(async (req, res) => {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
        return sendResponse(res, 404, false, "User not found");
    }
    return sendResponse(res, 200, true, "User", user);
}
);

// get user by id
export const getUserById = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return sendResponse(res, 404, false, "User not found");
    }
    return sendResponse(res, 200, true, "User", user);
});



