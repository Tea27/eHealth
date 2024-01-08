import { Appointment } from "../models/AppointmentModel.js";
import { User } from "../models/UserModel.js";
import mongoose from "mongoose";
import { appointmentStatus } from "../enums/AppointmentStatus.js";
import { userRole } from "../enums/UserRole.js";
import { Color } from "../enums/Colors.js";

export const createAppointment = async (req, res) => {
  const { Subject, Description, Location, StartTime, EndTime, Type, State } =
    req.body;
  const { email } = req.params;

  const patient = await User.findOne({ email: email });
  if (!patient) {
    return res.status(404).json({ message: "No user present" });
  }

  try {
    const appointment = await Appointment.create({
      Subject,
      Description,
      Location,
      StartTime,
      EndTime,
      Type,
      State,
      doctorID: patient.doctorID,
      patientID: patient._id,
    });

    res
      .status(200)
      .json({ message: "Appointment created", appointment: appointment });
  } catch (error) {
    res.status(400).json({ message: "Failed to create appointment" });
  }
  // res.send("Post creation");
};

export const getAllAppointments = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    var appointments;
    if (user.role === userRole.Admin) {
      appointments = await Appointment.find().sort({ createdAt: -1 });
    } else if (user.role === userRole.Doctor) {
      appointments = await Appointment.find({ doctorID: id }).sort({
        createdAt: -1,
      });
    } else {
      appointments = await Appointment.find({ doctorID: user.doctorID }).sort({
        createdAt: -1,
      });
    }

    let formattedAppointments = appointments.map((appointment) => {
      let categoryColor;
      if (
        user.role === userRole.Patient &&
        appointment.patientID.toString() !== user._id.toString()
      ) {
        appointment.Subject = "Scheduled appointment";
        categoryColor = Color.Gray;
      } else if (appointment.State === appointmentStatus.Accepted) {
        categoryColor = Color.Green;
      } else {
        categoryColor = Color.Orange;
      }

      const formattedAppointment = {
        ...appointment.toJSON(),
        CategoryColor: categoryColor,
      };

      if (
        user.role === userRole.Patient &&
        appointment.patientID.toString() !== user._id.toString()
      ) {
        delete formattedAppointment.Location;
        delete formattedAppointment.Description;
      }

      return formattedAppointment;
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No appointment present" });
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true }
  );

  if (!appointment) {
    return res.status(404).json({ message: "No appointment present" });
  }

  res.status(200).json(appointment);
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No appointment present" });
  }

  const appointment = await Appointment.findOneAndDelete({ _id: id });

  if (!appointment) {
    return res.status(404).json({ message: "No appointment present" });
  }

  res.status(200).json(appointment);
};

export const getAppointmentsByMonth = async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$StartTime" },
            month: { $month: "$StartTime" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          months: {
            $push: {
              month: "$_id.month",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = [];

    for (let yearData of appointments) {
      const monthlyCounts = Array.from({ length: 12 }, (_, index) => {
        const month = yearData.months.find((m) => m.month === index + 1);
        return month ? month.count : 0;
      });
      data.push({ year: yearData._id, data: monthlyCounts });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching appointment statistics:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
