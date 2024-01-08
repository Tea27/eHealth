"use strict";

import mongoose from "mongoose";
import { User } from "../models/UserModel.js";

const PatientSchema = new mongoose.Schema({
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  OIB: {
    type: String,
    required: true,
    min: 11,
    max: 11,
  },
  MBO: {
    type: String,
    required: true,
    max: 9,
    min: 9,
  },
  insurance: {
    type: String,
    min: 3,
    max: 255,
  },
  doctorID: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Patient = User.discriminator("Patient", PatientSchema);
