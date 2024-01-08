import express from "express";

import {
  createRating,
  getAllRatings,
  getAverageRatings,
} from "../controllers/RatingController.js";

const router = express.Router();

router.post("/create/:id/:token", createRating);
router.get("/getAverage", getAverageRatings);
router.get("/getAllRatings", getAllRatings);

export default router;
