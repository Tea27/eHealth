import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post("/create", createMessage);

router.get("/get/:id", getMessages);

export default router;
