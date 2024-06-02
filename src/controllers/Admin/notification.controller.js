import jwt from 'jsonwebtoken';
import Admin from "../../models/admin.model.js";
import Notification from "../../models/notification.model.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";

// just create a function to create notification, title, description, department, type will be passed in the body
export const createNotification = async (title, description, department, type, destinationUrl) => {
    try {
        const notification = new Notification({ title, description, department, type, destinationUrl });
        return await notification.save();
    }
    catch (error) {
        throw error;
    }
}

// create a controller to get all notifications, use pagination
export const getAllNotifications = AsyncHandler(async (req, res) => {
    try {
        let department = null;
        let type = null;

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.decode(token, { complete: true });
            const userInfo = decoded?.payload;

            if (userInfo?.id) {
                const userDataFromDB = await Admin.findById(userInfo?.id).populate('department').select("-password");

                // "admin", "doctor", "lab", "pharmacy", "receptionist"
                if (userDataFromDB?.role === 'admin') {
                    type = 'admin';
                }
                else if (userDataFromDB?.role === 'receptionist') {
                    type = 'receptionist';
                    department = userDataFromDB?.department?._id || null;
                }
                else if (userDataFromDB?.role === 'lab') {
                    type = 'lab';
                    department = userDataFromDB?.department?._id || null;
                }
                else if (userDataFromDB?.role === 'pharmacy') {
                    type = 'pharmacy';
                    department = userDataFromDB?.department?._id || null;
                }
                else {
                    department = userDataFromDB?.department?._id || null;
                    type = userDataFromDB?.department?.name || null;
                }

            }
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 11;
        const skip = (page - 1) * limit;

        let query = {};
        if (department !== null && type !== null) {
            query = {
                $or: [
                    { department },
                    {
                        type: { $regex: type, $options: "i" }
                    }
                ]
            }
        }
        else if (department !== null) {
            query = { department };
        }
        else if (type !== null) {
            query = { type: { $regex: type, $options: "i" } };
        }

        let notifications;
        if (type === 'admin') {
            notifications = await Notification.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        }
        else {
            notifications = await Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        }

        // unvisited notification count 
        let query2 = { isViewed: false };
        if (department !== null && type !== null) {
            query2 = {
                $and: [
                    { isViewed: false },
                    {
                        $or: [
                            { department },
                            { type: { $regex: type, $options: "i" } }
                        ]
                    }
                ]
            };

        }
        else if (department !== null) {
            query2 = {
                $and: [
                    { isViewed: false },
                    { department }
                ]
            }
        }
        else if (type !== null) {
            query2 = {
                $and: [
                    { isViewed: false },
                    { type: { $regex: type, $options: "i" } }
                ]
            }

        }

        let notificationsCount;
        if (type === 'admin') {
            notificationsCount = await Notification.countDocuments({ isViewed: false });
        }
        else {
            notificationsCount = await Notification.countDocuments(query2);
        }

        // console.log({ notificationsCount, notifications: notifications?.length })

        return sendResponse(res, 200, true, "Notifications successfully retrieved", { count: notificationsCount, data: notifications });
    }
    catch (error) {
        console.log({ error })
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

// delete single notification 
export const deleteNotificationById = async (req, res) => {
    try {

        await Notification.findByIdAndDelete(req.params?.id);
        return sendResponse(res, 200, true, "Notification deleted successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

// seen single notification 
export const seenNotificationById = async (req, res) => {
    try {

        await Notification.findByIdAndUpdate(req.params?.id, { $set: { isViewed: true } }, { new: true });
        return sendResponse(res, 200, true, "Notification read successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
}

export const seenAllNotifications = AsyncHandler(async (req, res) => {
    try {
        await Notification.updateMany({ isViewed: false }, { $set: { isViewed: true } }, { new: true });
        return sendResponse(res, 200, true, "All notifications seen successfully");
    }
    catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
});

