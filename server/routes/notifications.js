import express from "express";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  updateNotification,
} from "../controllers/NofiticationController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();
router.get("/getAllNotifications/:email", getAllNotifications);

router.use(requireAuth);

router.post("/create/:id", createNotification);
router.patch("/updateNotification/:id", updateNotification);
router.delete("/delete/:id", deleteNotification);

export default router;
