import express from "express";
import {
  createConversation,
  findConversations,
  getConversation,
} from "../controllers/ConversationController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/create", createConversation);

router.get("/:userID", getConversation);

router.get("/find/:firstID/:secondID", findConversations);

export default router;
