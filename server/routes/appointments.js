import express from "express";

import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointment,
  getAppointmentsByMonth,
} from "../controllers/AppointmentController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/getByMonth", getAppointmentsByMonth);

router.use(requireAuth);

router.get("/getAll/:id", getAllAppointments);

router.post("/create/:email", createAppointment);
router.post("/updateAppointment/:id", updateAppointment);

router.delete("/delete/:id", deleteAppointment);

export default router;
