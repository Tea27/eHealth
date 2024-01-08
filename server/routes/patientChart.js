import express from "express";
import {
  getPatientCharts,
  createPatientChart,
  getPatientsByCondition,
} from "../controllers/PatientChartController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/getByCondition", getPatientsByCondition);

router.use(requireAuth);

router.post("/create", createPatientChart);
router.get("/getPatientCharts/:id", getPatientCharts);

export default router;
