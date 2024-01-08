"use strict";

import mongoose from "mongoose";
import { userRole } from "../enums/UserRole.js";
import { userStatus } from "../enums/UserStatus.js";

const baseOption = {
  discriminatorKey: "type",
  collection: "user",
};

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      max: 1024,
      min: 6,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    info: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.Patient,
    },
    state: {
      type: String,
      enum: Object.values(userStatus),
      default: userStatus.Active,
    },
  },
  baseOption
);

export const User = mongoose.model("User", UserSchema);
