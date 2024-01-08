import mongoose from "mongoose";

const notifSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    receiverID: { type: mongoose.Types.ObjectId, ref: "User" },
    conversationID: { type: mongoose.Types.ObjectId, ref: "Conversation" },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notifSchema);
