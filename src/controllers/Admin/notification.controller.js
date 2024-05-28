import Notification from "../../models/notification.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";

// just create a function to create notification, title, description, department, type will be passed in the body
export const createNotification = async (title, description, department, type) => {
    try {
        const notification = new Notification({ title, description, department, type });
        return await notification.save();
    }
    catch (error) {
        throw error;
    }
}

// create a controller to get all notifications, use pagination
export const getAllNotifications = AsyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const notifications = await Notification.find().skip(skip).limit(limit);
        return sendResponse(res, 200, true, "Notifications successfully retrieved", { data: notifications });
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});

// create controller to delete notifcations of last month
export const deleteNotifications = AsyncHandler(async (req, res) => {
    try {
        const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
        await Notification.deleteMany({ createdAt: { $lte: lastMonth } });
        return sendResponse(res, 200, true, "Notifications deleted successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});


// create a controller to get all notifications, use pagination
export const getSpecificNotifications = AsyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const department = req.query?.department;
        const type = req.query?.type;

        let query = {};

        if (department && type) {
            query = {
                $or: [
                    { department },
                    {
                        type: { $regex: type, $options: "i" }
                    }
                ]
            }
        }
        else if (department) {
            query = { department };
        }
        else if (type) {
            query = { type: { $regex: type, $options: "i" } };
        }



        const notifications = await Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        return sendResponse(res, 200, true, "Notifications successfully retrieved", { count: notifications.length, data: notifications });
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});

