import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userID: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 5,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
