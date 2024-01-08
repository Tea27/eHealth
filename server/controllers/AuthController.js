import joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import { Patient } from "../models/PatientModel.js";
import { Token } from "../models/Token.js";
import {
  registerValidation,
  loginValidation,
  passwordValidation,
  registerPatientValidation,
} from "../validators/validation.js";
import { sendEmail } from "../utils/mailer.js";
import crypto from "crypto";
import { Conversation } from "../models/ConversationModel.js";
import { userStatus } from "../enums/UserStatus.js";

export const register = async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const user = new User(req.body);

  try {
    const savedUser = await user.save();
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userID: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/set-password/${encodeURIComponent(
      user._id
    )}/${encodeURIComponent(token.token)}`;

    sendEmail(
      savedUser.email,
      "password setup",
      `
          <h3>eHealth account created</h3>
          <p>A new account has been created for ${user.email}. Please follow the link to set up password</p>
          <a href="${link}">Create password</a>
        `
    );
    res.status(200).json({ email: req.body.email, token: token.token });
  } catch (error) {
    res.status(400).json({ error: "An error occurred. Please try again." });
  }
};

export const login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ error: "Email is not found" });
  }
  if (user.state === userStatus.Disabled) {
    return res.status(400).json({ error: "Account is deactivated" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "3d",
  });

  res.status(200).json({
    _id: user._id,
    email: req.body.email,
    token: token,
    role: user.role,
  });
};

export const setPassword = async (req, res) => {
  try {
    const { error } = passwordValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.params.userID);
    if (!user)
      return res.status(400).json({ error: "Invalid link or expired" });

    const token = await Token.findOne({
      userID: user._id,
      token: req.params.token,
    });

    if (!token)
      return res.status(400).json({ error: "Invalid link or expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    await user.save();
    await token.delete();

    res.status(200).json({ message: "Password set successfully." });
  } catch (error) {
    res.status(400).json({ error: "An error occurred. Please try again." });
  }
};

export const registerPatient = async (req, res) => {
  const { error } = registerPatientValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const { id } = req.params;

  const doctor = await User.findById(id);
  const patient = new Patient({
    ...req.body,
    doctorID: doctor._id,
  });
  try {
    const savedUser = await patient.save();

    let token = await Token.findOne({ userID: patient._id });
    if (!token) {
      token = await new Token({
        userID: patient._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/set-password/${encodeURIComponent(
      patient._id
    )}/${encodeURIComponent(token.token)}`;
    sendEmail(
      patient.email,
      "password setup",
      `
        <h3>eHealth account created</h3>
        <p>A new account has been created for ${patient.email}. Please follow the link to set up password</p>
        <a href="${link}">Create password</a>
      `
    );

    const conversation = new Conversation({
      firstUserID: doctor._id,
      secondUserID: patient._id,
    });
    await conversation.save();
    res.status(200).json({ email: req.body.email, token: token.token });
  } catch (error) {
    res.status(400).json({ error: "An error occurred. Please try again." });
  }
};
