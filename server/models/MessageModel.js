"use strict";

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      min: 3,
      max: 255,
    },
    senderID: { type: mongoose.Types.ObjectId, ref: "User" },
    conversationID: { type: mongoose.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
