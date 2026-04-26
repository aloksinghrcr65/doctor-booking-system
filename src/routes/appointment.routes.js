import express from "express";
import { getSlots } from "../controllers/appointment.controller.js";
import { createAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/doctors/:id/slots", getSlots);

export default router;