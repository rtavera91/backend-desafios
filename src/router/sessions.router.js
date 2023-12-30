import { Router } from "express";
import passport from "passport";
import transporter from "../nodemailer.js";
import { usersManager } from "../dao/managers/usersManager.js";
import { findUserById } from "../controllers/users.controller.js";
import { generateToken, compareData, hashData } from "../utils.js";
import { isUser } from "../middlewares/auth.middleware.js";
import UserDTO from "../dao/DTOs/userDTO.js";
import config from "../config/config.js";
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
    const token = generateToken({
      id: userDB._id,
      role: userDB.role,
      email: userDB.email,
    });

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

//ruta para iniciar flujo de recuperación de contraseña (generamos token de recuperación de contraseña y lo enviamos por email)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const userDB = await usersManager.findByEmail(email);
    if (!userDB) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken({ id: userDB._id }, "1h");
    const link = `${config.client_url}/reset-password/${token}`;
    const emailData = {
      from: config.gmail_user,
      to: email,
      subject: "Password Reset Link",
      html: `
        <h1>Please use the following link to reset your password</h1>
        <a href="${link}" target="_blank">Reset Password</a>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${config.client_url}</p>
      `,
    };
    await transporter.sendMail(emailData);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ruta para validar que el token de recuperación de contraseña sea válido y no haya expirado
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const decodedToken = jwtValidation(token);
    const userDB = await usersManager.findById(decodedToken.id);
    if (!userDB) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Valid token" });
    res.redirect(`${config.client_url}/resetpassword/${token}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ruta para comparar contraseña nueva con la actual (no puede ser igual) y en caso de avanzar, guardarla en la base de datos junto con mensaje de confirmación. Se genera un nuevo token de sesión.
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decodedToken = jwtValidation(token);
    const userDB = await usersManager.findById(decodedToken.id);
    if (!userDB) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValid = await compareData(password, userDB.password);
    if (isValid) {
      return res
        .status(400)
        .json({ message: "New password must be different from current one" });
    }
    const hashedPassword = await hashData(password);
    await usersManager.updateOne(decodedToken.id, { password: hashedPassword });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
