import { Message } from "../models/MessageModel.js";

export const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({
      conversationID: id,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
