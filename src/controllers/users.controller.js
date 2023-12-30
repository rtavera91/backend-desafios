import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/not_found.error.js";
import {
  findAll,
  findById,
  createOne,
  updateOne,
  deleteOne,
  findByEmail,
} from "../services/users.service.js";

export const findUsers = async (req, res) => {
  const users = await findAll();
  if (!users.length) {
    res.status(200).json(CustomError.createError(ErrorMessages.NO_USERS_FOUND));
  } else {
    res.status(200).json({ message: "Users found", users });
  }
};

export const findUserById = async (req, res) => {
  const { uid } = req.params;
  const user = await findById(uid); // Pasa el ID del usuario
  if (user) {
    res.status(200).json({ message: "User found", user });
  } else {
    res.status(404).json(CustomError.createError(ErrorMessages.NO_USERS_FOUND));
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res
      .status(400)
      .json(CustomError.createError(ErrorMessages.MISSING_FIELDS));
  }
  const createdUser = await createOne(req.body);
  if (createdUser) {
    res.status(200).json({ message: "User created", user: createdUser });
  } else {
    res
      .status(500)
      .json(CustomError.createError(ErrorMessages.INTERNAL_SERVER_ERROR));
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const { email, password } = req.body;
  const updatedUser = await updateOne(uid, email, password);
  if (updatedUser) {
    res.status(200).json({ message: "User updated", user: updatedUser });
  } else {
    res.status(404).json(CustomError.createError(ErrorMessages.NO_USERS_FOUND));
  }
};

export const deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await deleteOne(uid);
    if (result) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.NO_USERS_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDB = await findByEmail(email);
    if (!userDB) {
      return res
        .status(400)
        .json(CustomError.createError(ErrorMessages.INVALID_CREDENTIALS));
    }
    const isValid = await compareData(password, userDB.password);
    if (!isValid) {
      return res
        .status(401)
        .json(CustomError.createError(ErrorMessages.INVALID_CREDENTIALS));
    }
    res.status(200).json({ message: `Welcome ${userDB.email}!` });
  } catch (error) {
    res.status(500).json({ error: "Error", error });
  }
};

export const updateUserRole = async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;
  if (!role) {
    return res
      .status(400)
      .json(CustomError.createError(ErrorMessages.MISSING_FIELDS));
  }
  const updatedUser = await updateOne(uid, role);
  if (updatedUser) {
    res.status(200).json({ message: "User updated", user: updatedUser });
  } else {
    res.status(404).json(CustomError.createError(ErrorMessages.NO_USERS_FOUND));
  }
};
