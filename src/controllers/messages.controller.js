import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/not_found.error.js";
import { findAll, createOne } from "../services/messages.service.js";

export const findMessages = async (req, res) => {
  try {
    const messages = await findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const message = await createOne(req.body);
    if (!name || !email || !message) {
      res
        .status(400)
        .json(CustomError.createError(ErrorMessages.MISSING_FIELDS));
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
