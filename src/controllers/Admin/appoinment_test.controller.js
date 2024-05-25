import AppointmentTest from "../../models/appointment_test.model";
import sendResponse from "../../utils/sendResponse";

export const createAppointmentTest = async (req, res) => {
    const data = req.body;

    try {
        const result = await AppointmentTest.create(data);

        sendResponse(res, 200, true, "Successfully created appointment", result);
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, error.message);
    }
}

