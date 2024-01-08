import { User } from "../models/UserModel.js";
import { Notification } from "../models/NotificationModel.js";
import { sendEmail } from "../utils/mailer.js";
import { Conversation } from "../models/ConversationModel.js";
import mongoose from "mongoose";

export const createNotification = async (req, res) => {
  const { id } = req.params;
  const {
    doctorID,
    patientID,
    StartTime,
    Subject,
    Description,
    Location,
    Text,
  } = req.body;

  const patient = await User.findById(patientID);
  const doctor = await User.findById(doctorID);

  if (!patient || !doctor) {
    return res.status(404).json({ message: "No user present" });
  }

  const conversation = await Conversation.findOne({
    $or: [
      {
        firstUserID: doctorID,
        secondUserID: patientID,
      },
      {
        firstUserID: patientID,
        secondUserID: doctorID,
      },
    ],
  });

  try {
    const date = new Date(StartTime).toLocaleString();
    const text = `${Text} for ${patient.email} at ${date}. Appointment details: subject - ${Subject}, description - ${Description}, location - ${Location}`;
    const doctorNotif = await Notification.create({
      text: text,
      conversationID: conversation._id,
      receiverID: doctorID,
      viewed: false,
    });
    const patientNotif = await Notification.create({
      text: text,
      conversationID: conversation._id,
      receiverID: patientID,
      viewed: false,
    });

    sendEmail(patient.email, Text, text);
    sendEmail(doctor.email, Text, text);

    res.status(200).json({ message: Text });
  } catch (error) {
    res.status(400).json({ message: "Failed to create notificiation" });
  }
};

export const getAllNotifications = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "No user present" });
  }

  try {
    const notifications = await Notification.find({
      receiverID: user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const updatedNotification = req.body;
  Notification.findByIdAndUpdate(id, updatedNotification, { new: true })
    .then((updatedNotification) => {
      res.status(200).json(updatedNotification);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No notification present" });
  }

  const notification = await Notification.findOneAndDelete({ _id: id });

  if (!notification) {
    return res.status(404).json({ message: "No notification present" });
  }

  res.status(200).json(notification);
};
