import mongoose from "mongoose";
import { appointmentStatus } from "../enums/AppointmentStatus.js";
import { appointmentType } from "../enums/AppointmentType.js";

const appointmentSchema = new mongoose.Schema(
  {
    Subject: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
    },
    Location: {
      type: String,
    },
    StartTime: {
      type: Date,
      required: true,
      min: new Date().toISOString(),
    },
    EndTime: {
      required: true,
      type: Date,
    },
    Type: {
      type: String,
      enum: Object.values(appointmentType),
      default: appointmentType.Routine,
    },
    State: {
      type: String,
      enum: Object.values(appointmentStatus),
      default: appointmentStatus.Pending,
    },
    doctorID: { type: mongoose.Types.ObjectId, ref: "User" },
    patientID: { type: mongoose.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
