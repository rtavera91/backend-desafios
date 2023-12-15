import { ticketsModel } from "../models/tickets.model.js";
import mongoose from "mongoose";

class TicketsManager {
  async findAll() {
    const tickets = await ticketsModel.find().populate("cart").exec();
    return tickets;
  }

  async findById(id) {
    const ticket = await ticketsModel.findById(id).populate("cart");
    return ticket;
  }

  async createOne(...cart) {
    const ticket = await ticketsModel.create({ cart });
    return ticket;
  }

  async updateOne(id, data) {
    const ticket = await ticketsModel.findById(id);
    if (ticket) {
      await ticket.updateOne(data);
      return ticket;
    } else {
      return { error: "Ticket not found" };
    }
  }

  async deleteOne(id) {
    const ticket = await ticketsModel.findById(id);
    if (ticket) {
      await ticket.remove();
      return ticket;
    } else {
      return { error: "Ticket not found" };
    }
  }
}

export const ticketsManager = new TicketsManager();
