import { Conversation } from "../models/ConversationModel.js";

export const createConversation = async (req, res) => {
  const firstUserID = req.body.firstID;
  const secondUserID = req.body.secondID;

  const newConversation = new Conversation({
    firstUserID: firstUserID,
    secondUserID: secondUserID,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getConversation = async (req, res) => {
  const userID = req.params.userID;
  try {
    const conversation = await Conversation.find({
      $or: [{ firstUserID: userID }, { secondUserID: userID }],
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const findConversations = async (req, res) => {
  const firstID = req.params.firstID;
  const secondID = req.params.secondID;
  try {
    const conversations = await Conversation.find({
      $and: [{ firstUserID: firstID }, { secondUserID: secondID }],
    }).sort({ createdAt: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
};
