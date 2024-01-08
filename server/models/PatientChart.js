"use strict";

import mongoose from "mongoose";

const patientChartSchema = new mongoose.Schema(
  {
    condition: {
      type: String,
    },
    data: {
      type: String,
      required: true,
    },
    images: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    patientID: { type: mongoose.Types.ObjectId, ref: "Patient" },
  },
  { timestamps: true }
);

export const PatientChart = mongoose.model("PatientChart", patientChartSchema);
