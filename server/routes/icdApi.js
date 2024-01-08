import express from "express";
import { fetchFromApi } from "../controllers/ApiController.js";

const router = express.Router();

router.get("/fetchFromApi", fetchFromApi);

export default router;
