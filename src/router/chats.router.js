import { Router } from "express";
import { isUser } from "../middlewares/auth.middleware.js";
import {
  findMessages,
  createMessage,
} from "../controllers/messages.controller.js";

const router = Router();

router.get("/", findMessages);

router.post("/", isUser, createMessage);

export const chatsRouter = router;
