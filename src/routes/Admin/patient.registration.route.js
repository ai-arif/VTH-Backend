import { Router } from "express";

const patientRegistrationRouter = Router();

import {
    createPatientRegistrationForm,
    deletePatientRegistrationFormById,
    getAllPatientRegistrationForms,
    getPatientRegistrationFormById,
    searchPatientRegistrationForms,
    updatePatientRegistrationFormById
} from "../../controllers/Admin/patient.registration_form.controller.js";


patientRegistrationRouter.post("/", createPatientRegistrationForm);
patientRegistrationRouter.get("/", getAllPatientRegistrationForms);
patientRegistrationRouter.get("/search", searchPatientRegistrationForms);
patientRegistrationRouter.get("/:id", getPatientRegistrationFormById);
patientRegistrationRouter.put("/:id", updatePatientRegistrationFormById);
patientRegistrationRouter.delete("/:id", deletePatientRegistrationFormById);


export default patientRegistrationRouter;
