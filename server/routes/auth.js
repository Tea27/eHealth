import express from "express";
import {
  login,
  register,
  registerPatient,
  setPassword,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/set-password/:userID/:token", setPassword);

router.post("/registerPatient/:id", registerPatient);

export default router;
