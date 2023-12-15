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
    res.status(200).json({ message: "Tickets found", tickets });
  }
};

export const findTicketById = async (req, res) => {
  const { tid } = req.params;
  const ticket = await findById(tid);
  if (ticket) {
    res.status(200).json({ message: "Ticket found", ticket });
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

export const createTicket = async (req, res) => {
  const { cart } = req.body;
  const createdTicket = await createOne(...cart);
  if (createdTicket) {
    res.status(200).json({ message: "Ticket created", ticket: createdTicket });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
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
      res.status(404).json({ message: "Ticket not found" });
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
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
