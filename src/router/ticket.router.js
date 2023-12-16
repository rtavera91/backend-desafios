import {
  findTickets,
  findTicketById,
  createTicket,
} from "../controllers/tickets.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", findTickets);
router.get("/:tid", findTicketById);
router.post("/", createTicket);

export const ticketRouter = router;
