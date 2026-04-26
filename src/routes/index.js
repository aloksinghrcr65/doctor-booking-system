import express from "express";
import doctorRoutes from "./doctor.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createDoctorSchema, bookAppointmentSchema } from "../validators/validator.js";
const router = express.Router();


// Doctor routes
router.use("/doctors", validate(createDoctorSchema), doctorRoutes);

// Appointment routes
router.use("/appointments", validate(bookAppointmentSchema), appointmentRoutes);

export default router;
