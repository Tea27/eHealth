// import User from "../models/UserModel.js";

import mongoose from "mongoose";
import { User } from "../models/UserModel.js";
import { userRole } from "../enums/UserRole.js";
import { Patient } from "../models/PatientModel.js";
import { userStatus } from "../enums/UserStatus.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: userRole.Patient }).sort({
      createdAt: -1,
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const searchPatients = async (req, res) => {
  const { searchInput, id } = req.params;
  const trimmedSearchInput = searchInput.trim();
  const searchRegex = new RegExp(trimmedSearchInput, "i");
  try {
    const user = await User.findById(id);

    let patientsQuery = {
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { OIB: { $regex: searchRegex } },
        { MBO: { $regex: searchRegex } },
      ],
    };

    if (user.role === userRole.Doctor) {
      // Only search for patients where patient.doctorID matches the doctor's ID
      patientsQuery.state = userStatus.Active;
      patientsQuery.doctorID = user._id;
    }

    const patients = await Patient.find(patientsQuery).sort({
      createdAt: -1,
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPatientsByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const patients = await Patient.find({
      $and: [
        { role: userRole.Patient },
        { doctorID: id },
        { state: userStatus.Active },
      ],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      $and: [{ role: userRole.Doctor }],
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const searchDoctors = async (req, res) => {
  const { searchInput } = req.params;
  const trimmedSearchInput = searchInput.trim();
  const searchRegex = new RegExp(trimmedSearchInput, "i");
  try {
    const doctors = await User.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: searchRegex } },
            { lastName: { $regex: searchRegex } },
            { email: { $regex: searchRegex } },
          ],
        },
        { role: userRole.Doctor },
      ],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(doctors);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const findByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "No user present" });
  }

  res.status(200).json(user);
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No user present" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "No user present" });
  }

  res.status(200).json(user);
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  res.send("Post creation");
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No user present" });
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(404).json({ message: "No user present" });
  }

  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "No user present" });
  }
  const userToUpdate = await User.findById(id);

  const user =
    userToUpdate.role === userRole.Patient
      ? await Patient.findOneAndUpdate({ _id: id }, { ...req.body })
      : await User.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!user) {
    return res.status(404).json({ message: "No user present" });
  }

  res.status(200).json({ ...req.body });
};

export const deactivate = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { state: userStatus.Disabled },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user present" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export const activate = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { state: userStatus.Active },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user present" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
