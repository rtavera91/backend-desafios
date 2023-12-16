import { ErrorMessages } from "../errors/error.enum.js";
import CustomError from "../errors/not_found.error.js";
import {
  findAll,
  findById,
  createOne,
  updateOne,
  deleteOne,
} from "../services/tickets.service.js";

export const findTickets = async (req, res) => {
  const tickets = await findAll();
  if (!tickets.length) {
    res.status(200).json({ message: "No Tickets Found" });
  } else {
    res
      .status(200)
      .json(CustomError.createError(ErrorMessages.TICKET_NOT_FOUND));
  }
};

export const findTicketById = async (req, res) => {
  const { tid } = req.params;
  const ticket = await findById(tid);
  if (ticket) {
    res.status(200).json({ message: "Ticket found", ticket });
  } else {
    res
      .status(404)
      .json(CustomError.createError(ErrorMessages.TICKET_NOT_FOUND));
  }
};

export const createTicket = async (paramsOrId) => {
  const { cart, purchase_datetime, quantity, purchaser, code } =
    paramsOrId.params || paramsOrId;

  try {
    const createdTicket = await createOne(
      cart,
      purchase_datetime,
      quantity,
      purchaser,
      code
    );

    if (createdTicket.error) {
      return { error: createdTicket.error };
    }

    return { ticket: createdTicket };
  } catch (error) {
    console.error(error.message);
    return CustomError.createError(ErrorMessages.INTERNAL_SERVER_ERROR);
  }
};

export const updateTicket = async (req, res) => {
  const { tid } = req.params;
  const data = req.body;
  try {
    const updatedTicket = await updateOne(tid, data);
    if (updatedTicket) {
      res
        .status(200)
        .json({ message: "Ticket updated", ticket: updatedTicket });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.TICKET_NOT_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  const { tid } = req.params;
  try {
    const result = await deleteOne(tid);
    if (result) {
      res.status(200).json({ message: "Ticket deleted" });
    } else {
      res
        .status(404)
        .json(CustomError.createError(ErrorMessages.TICKET_NOT_FOUND));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
