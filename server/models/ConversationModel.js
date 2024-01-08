"use strict";

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    firstUserID: { type: mongoose.Types.ObjectId, ref: "User" },
    secondUserID: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
