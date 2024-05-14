import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/Admin/admin.route.js";
const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cors())

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Importing Routes Here
import userRouter from "./routes/User/user.route.js";
import testRouter from "./routes/Admin/test.route.js";
import appointmentRouter from "./routes/Admin/appointment.route.js";
import departmentRouter from "./routes/Admin/department.route.js";
import medicineRouter from "./routes/Admin/medicine.route.js";
import prescriptionRouter from "./routes/Admin/prescription.route.js";
import patientRegistrationRouter from "./routes/Admin/patient.registration.route.js";
import notificationRouter from "./routes/Admin/notification.route.js";
import adminRouter from "./routes/Admin/admin.route.js";
import adminUserRouter from "./routes/Admin/user.route.js";

//Declaration of Routes Here
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staffs", userRouter);
app.use("/api/v1/admin-user", adminUserRouter);
app.use('/api/v1/test',testRouter)
app.use('/api/v1/appointment',appointmentRouter)
app.use('/api/v1/department',departmentRouter)
app.use('/api/v1/medicine',medicineRouter)
app.use('/api/v1/prescription',prescriptionRouter)
app.use('/api/v1/patient-registration',patientRegistrationRouter)
app.use('/api/v1/notification',notificationRouter)

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});


export { app };
