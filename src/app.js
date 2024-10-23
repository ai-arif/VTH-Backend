import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import adminRoutes from "./routes/Admin/admin.route.js";
const app = express();

dotenv.config({
  path: "./.env",
});
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Importing Routes Here
import adminRouter from "./routes/Admin/admin.route.js";
import appointmentRouter from "./routes/Admin/appointment.route.js";
import breedRouter from "./routes/Admin/breed.route.js";
import complaintRouter from "./routes/Admin/complaint.route.js";
import contentRouter from "./routes/Admin/content.route.js";
import departmentRouter from "./routes/Admin/department.route.js";
import adminFeedbackRouter from "./routes/Admin/feedback.route.js";
import logoRouter from "./routes/Admin/logo.route.js";
import medicineRouter from "./routes/Admin/medicine.route.js";
import medicineParamRouter from "./routes/Admin/medicine_params.route.js";
import notificationRouter from "./routes/Admin/notification.route.js";
import patientRegistrationRouter from "./routes/Admin/patient.registration.route.js";
import prescriptionRouter from "./routes/Admin/prescription.route.js";
import speciesRouter from "./routes/Admin/species.route.js";
import testRouter from "./routes/Admin/test.route.js";
import adminUserRouter from "./routes/Admin/user.route.js";

// user routes

import { overviewRoute } from "./routes/Admin/overview.route.js";
import pharmacyRoute from "./routes/Admin/pharmacy.route.js";
import userAppointmentRouter from "./routes/User/appointment.route.js";
import userFeedbackRouter from "./routes/User/feedback.route.js";
import homeRouter from "./routes/User/home.route.js";
import userPrescriptionRouter from "./routes/User/prescription.route.js";
import userRouter from "./routes/User/user.route.js";

//Declaration of Routes Here
app.use("/api/v1/overview", overviewRoute);
app.use("/api/v1/staffs", adminRouter);
// app.use("/api/v1/staffs", userRouter);
app.use("/api/v1/admin-user", adminUserRouter);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/medicine", medicineRouter);
app.use("/api/v1/prescription", prescriptionRouter);
app.use("/api/v1/patient-registration", patientRegistrationRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/species", speciesRouter);
app.use("/api/v1/complaint", complaintRouter);
app.use("/api/v1/breed", breedRouter);
app.use("/api/v1/medicine-params", medicineParamRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/logo", logoRouter);
app.use("/api/v1/feedback", adminFeedbackRouter);

//  user routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/user-appointment", userAppointmentRouter);
app.use("/api/v1/user-prescription", userPrescriptionRouter);
app.use("/api/v1/user-feedback", userFeedbackRouter);
app.use("/api/v1/home", homeRouter);

//pharmacy routes
app.use("/api/v1/pharmacy", pharmacyRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

export { app };

