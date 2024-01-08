"use strict";

import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rateNumber: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
    patientID: { type: mongoose.Types.ObjectId, ref: "Patient" },
    userID: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Rating = mongoose.model("Rating", ratingSchema);
