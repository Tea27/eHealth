// Import the required modules
import { PatientChart } from "../models/PatientChart.js";
import { Patient } from "../models/PatientModel.js";
import { Token } from "../models/Token.js";
import { sendEmail } from "../utils/mailer.js";
import crypto from "crypto";

export const createPatientChart = async (req, res) => {
  try {
    const { condition, data, images, patientID } = req.body;

    const processedImages = [];

    for (const image of images) {
      const { data, contentType } = image;

      const processedImage = {
        data: Buffer.from(data, "base64"),
        contentType: contentType,
      };

      processedImages.push(processedImage);
    }

    const newPatientChart = new PatientChart({
      condition: condition,
      data: data,
      images: processedImages,
      patientID: patientID,
    });

    await newPatientChart.save();

    let token = await Token.findOne({ userID: patientID });
    if (!token) {
      token = await new Token({
        userID: patientID,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const patient = await Patient.findById(patientID);

    const link = `http://localhost:3000/Rating/${encodeURIComponent(
      patientID
    )}/${encodeURIComponent(token.token)}`;
    sendEmail(
      patient.email,
      "Rate your experience",
      `
        <h3>eHealth rating of your experience</h3>
        <p>Please take a moment of your time to let us know how your appointment was. Follow the link provided</p>
        <a href="${link}"> Rating review </a>
      `
    );

    res.status(201).json(newPatientChart);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

export const getPatientCharts = async (req, res) => {
  const { id } = req.params;

  try {
    const patientCharts = await PatientChart.find({ patientID: id }).sort({
      createdAt: -1,
    });

    res.status(200).json(patientCharts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPatientsByCondition = async (req, res) => {
  try {
    const conditionCounts = await PatientChart.aggregate([
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(conditionCounts);
  } catch (error) {
    console.error("Error fetching condition counts:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
