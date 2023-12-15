import { Router } from "express";
import passport from "passport";
import { usersManager } from "../dao/managers/usersManager.js";
import { findUserById } from "../controllers/users.controller.js";
import { generateToken, compareData, hashData } from "../utils.js";
import { isUser } from "../middlewares/auth.middleware.js";
import UserDTO from "../dao/DTOs/userDTO.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
const router = Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const isValid = await compareData(password, userDB.password);
    if (!isValid) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const token = generateToken({ id: userDB._id, role: userDB.role });

    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `Welcome ${userDB.first_name}`,
        token,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signup", async (req, res, next) => {
  const { password, email, first_name, last_name } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userDB = await usersManager.findByEmail(email);

    if (userDB) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hashData(password);
    const createdUser = await usersManager.createOne({
      ...req.body,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  isUser,
  async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const user = await usersManager.findById(currentUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userDTO = new UserDTO(user);
      res.status(200).json({ message: "Authorized", user: userDTO });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
    // const currentUser = req.user;
    // res.status(200).json({ message: "Authorized", user: req.user });
  }
);

export default router;
