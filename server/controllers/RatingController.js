import mongoose from "mongoose";
import { Rating } from "../models/RatingModel.js";
import { Patient } from "../models/PatientModel.js";
import { Token } from "../models/Token.js";

export const createRating = async (req, res) => {
  const { id } = req.params;
  const { review, rateNumber } = req.body;

  try {
    const patient = await Patient.findById(id);
    const token = await Token.findOne({
      userID: patient._id,
      token: req.params.token,
    });

    if (!token)
      return res.status(400).json({ error: "Invalid link or expired" });

    const rating = await Rating.create({
      name: `${patient.firstName} ${patient.lastName}`,
      rateNumber,
      review,
      patientID: patient._id,
      userID: patient.doctorID,
    });

    await token.delete();

    res.status(200).json(rating);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAverageRatings = async (req, res) => {
  try {
    const averageRatings = await Rating.aggregate([
      {
        $group: {
          _id: "$userID",
          averageRating: { $avg: "$rateNumber" },
        },
      },
    ]);

    res.status(200).json(averageRatings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching average ratings." });
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).populate({
      path: "userID",
    });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
